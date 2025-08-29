// components/tables/TransactionTable.tsx
import Card from "../ui/Card";
import { money } from "../../utils/functions";
import { type Transaction, type Category } from "../../types";

type Props = {
    rows: Transaction[];
    categories: Category[];
    onEdit: (tx: Transaction) => void;
    onDelete: (id: string) => void;
};

export default function TransactionTable({
    rows,
    categories,
    onEdit,
    onDelete,
}: Props) {
    const list: Transaction[] = Array.isArray(rows) ? rows : [];
    const cats: Category[] = Array.isArray(categories) ? categories : [];

    const catById = Object.fromEntries(cats.map((c) => [c.id, c]));

    return (
        <Card className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="text-left px-4 py-2">Date/Time</th>
                            <th className="text-left px-4 py-2">Type</th>
                            <th className="text-left px-4 py-2">Category</th>
                            <th className="text-right px-4 py-2">Amount</th>
                            <th className="text-left px-4 py-2">Note</th>
                            <th className="text-right px-4 py-2">
                                Actions
                            </th>{" "}
                            {/* NEW */}
                        </tr>
                    </thead>
                    <tbody>
                        {list.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-6 text-center text-slate-500"
                                >
                                    No transactions yet
                                </td>
                            </tr>
                        ) : (
                            list.map((r) => (
                                <tr
                                    key={r.id}
                                    className="odd:bg-white even:bg-slate-50"
                                >
                                    <td className="px-4 py-2">
                                        {new Date(r.datetime).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-2 capitalize">
                                        {r.type}
                                    </td>
                                    <td className="px-4 py-2">
                                        {catById[r.category]?.name ?? "—"}
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        {money(r.amount)}
                                    </td>
                                    <td className="px-4 py-2">
                                        {r.note ?? ""}
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* Edit */}
                                            <button
                                                type="button"
                                                onClick={() => onEdit(r)}
                                                className="inline-flex items-center rounded-lg border border-slate-200 px-2 py-1 hover:bg-slate-50"
                                                title="Edit"
                                            >
                                                {/* simple pencil svg */}
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                >
                                                    <path
                                                        d="M4 21l4.5-1 11-11-3.5-3.5-11 11L4 21z"
                                                        stroke="currentColor"
                                                    />
                                                </svg>
                                            </button>

                                            {/* Delete */}
                                            <button
                                                type="button"
                                                onClick={() => onDelete(r.id)}
                                                className="inline-flex items-center rounded-lg border border-rose-200 px-2 py-1 text-rose-600 hover:bg-rose-50"
                                                title="Delete"
                                            >
                                                {/* trash svg */}
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                >
                                                    <path
                                                        d="M3 6h18M8 6V4h8v2m-1 0v14H9V6h6z"
                                                        stroke="currentColor"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
