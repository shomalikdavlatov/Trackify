import Card from "../ui/Card";
import { money } from "../../utils/functions";
import { type Transaction, type Category } from "../../types";

type Props = {
    rows: Transaction[];
    categories: Category[];
};

export default function TransactionTable({ rows, categories }: Props) {
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
                        </tr>
                    </thead>
                    <tbody>
                        {list.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
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
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
