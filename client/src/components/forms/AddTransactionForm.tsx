import { useEffect, useMemo, useState } from "react";
import Button from "../ui/Button";
import { type Category, type TxType } from "../../types";
import { toast } from "react-toastify";
import { getCategoryAll } from "../../api/category";

interface Props {
    onSubmit: (payload: {
        type: TxType;
        categoryId: string;
        amount: number;
        note?: string;
        datetime: string;
    }) => void;
}

function toArray<T>(resData: any): T[] {
    if (Array.isArray(resData)) return resData as T[];
    if (Array.isArray(resData?.data)) return resData.data as T[];
    if (Array.isArray(resData?.items)) return resData.items as T[];
    return [];
}

function normalizeCategories(raw: any[]): Category[] {
    return raw.map((c: any) => ({
        id: c.id ?? c._id ?? String(c.id ?? c._id),
        name: c.name,
        type: c.type,
    }));
}

export default function AddTransactionForm({ onSubmit }: Props) {
    const [type, setType] = useState<TxType>("income");
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [categoryId, setCategoryId] = useState("");
    const [amount, setAmount] = useState<number>(0);
    const [note, setNote] = useState("");
    const [datetime, setDatetime] = useState<string>(() => {
        const d = new Date();
        const pad = (n: number) => String(n).padStart(2, "0");
        const local = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
            d.getDate()
        )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        return local;
    });

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const res = await getCategoryAll();
                const arr = toArray<any>(res.data);
                const normalized = normalizeCategories(arr);
                if (mounted) setCategories(normalized);
            } catch (e) {
                toast.error("Failed to load categories");
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    const filtered = useMemo(
        () => categories.filter((c) => c.type === type),
        [categories, type]
    );

    useEffect(() => {
        if (!filtered.some((c) => c.id === categoryId)) {
            setCategoryId("");
        }
    }, [type, filtered, categoryId]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!categoryId || amount <= 0) {
            toast.error("Please select category and set amount > 0");
            return;
        }

        const iso = new Date(datetime).toISOString();

        onSubmit({
            type,
            categoryId,
            amount: Math.trunc(amount), 
            note: note || undefined,
            datetime: iso,
        });
    };

    return (
        <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3">
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value as TxType)}
                    className="border rounded-xl px-3 py-2"
                    disabled={loading}
                >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>

                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="border rounded-xl px-3 py-2"
                    disabled={loading || filtered.length === 0}
                >
                    <option value="">
                        {loading ? "Loading..." : "Select category"}
                    </option>
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
                    step={1}
                    value={Number.isFinite(amount) ? amount : 0}
                    onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        setAmount(Number.isNaN(v) ? 0 : v);
                    }}
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
                <Button className="!w-full" type="submit" disabled={loading} label="Add"/>
            </div>

            {!loading && categories.length > 0 && filtered.length === 0 && (
                <div className="text-xs text-slate-500">
                    No categories under “{type}”. Create one first.
                </div>
            )}
        </form>
    );
}
