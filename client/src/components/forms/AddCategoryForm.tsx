import { useState } from "react";
import Button from "../ui/Button";
import { type TxType } from "../../types";
import { toast } from "react-toastify";

export default function AddCategoryForm({
    onSubmit,
}: {
    onSubmit: (payload: { name: string; type: TxType }) => void;
}) {
    const [name, setName] = useState("");
    const [type, setType] = useState<TxType>("income");
    return (
        <form
            className="space-y-3"
            onSubmit={(e) => {
                e.preventDefault();
                if (!name.trim())
                    return toast.error("Category name is required");
                onSubmit({ name: name.trim(), type });
            }}
        >
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category name"
                className="border rounded-xl px-3 py-2 w-full"
            />
            <select
                value={type}
                onChange={(e) => setType(e.target.value as TxType)}
                className="border rounded-xl px-3 py-2 w-full"
            >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
            </select>
            <div className="flex justify-end">
                <Button type="submit">Create</Button>
            </div>
        </form>
    );
}
