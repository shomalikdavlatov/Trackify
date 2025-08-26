import Card from "../ui/Card";
import { type Category } from "../../types";

export default function CategoryTable({ rows }: { rows: Category[] }) {
    return (
        <Card className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="text-left px-4 py-2">Name</th>
                            <th className="text-left px-4 py-2">Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => (
                            <tr
                                key={r.id}
                                className="odd:bg-white even:bg-slate-50"
                            >
                                <td className="px-4 py-2">{r.name}</td>
                                <td className="px-4 py-2 capitalize">
                                    {r.type}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
