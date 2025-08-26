import { useState } from "react";
import Button from "../ui/Button";
import { type Category, type TxType } from "../../types";
import { toast } from "react-toastify";

interface Props {
    categories: Category[];
    onSubmit: (payload: {
        type: TxType;
        categoryId: string;
        amount: number;
        note?: string;
        datetime: string;
    }) => void;
}
export default function AddTransactionForm({ categories, onSubmit }: Props) {
    const [type, setType] = useState<TxType>("income");
    const [categoryId, setCategoryId] = useState("");
    const [amount, setAmount] = useState<number>(0);
    const [note, setNote] = useState("");
    const [datetime, setDatetime] = useState<string>(
        new Date().toISOString().slice(0, 16)
    ); // yyyy-MM-ddTHH:mm

    const filtered = categories.filter((c) => c.type === type);

    return (
        <form
            className="space-y-3"
            onSubmit={(e) => {
                e.preventDefault();
                if (!categoryId || amount <= 0)
                    return toast.error(
                        "Please select category and set amount > 0"
                    );
                // convert datetime-local to ISO
                const iso = new Date(datetime).toISOString();
                onSubmit({
                    type,
                    categoryId,
                    amount,
                    note: note || undefined,
                    datetime: iso,
                });
            }}
        >
            <div className="grid grid-cols-2 gap-3">
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value as TxType)}
                    className="border rounded-xl px-3 py-2"
                >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="border rounded-xl px-3 py-2"
                >
                    <option value="">Select category</option>
                    {filtered.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                    placeholder="Amount"
                    className="border rounded-xl px-3 py-2"
                />
                <input
                    type="datetime-local"
                    value={datetime}
                    onChange={(e) => setDatetime(e.target.value)}
                    className="border rounded-xl px-3 py-2"
                />
            </div>
            <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Note (optional)"
                className="border rounded-xl px-3 py-2 w-full"
            />
            <div className="flex justify-end">
                <Button type="submit">Add</Button>
            </div>
        </form>
    );
}
