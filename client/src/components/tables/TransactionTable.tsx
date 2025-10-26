import Card from "../ui/Card";
import { useState } from "react";
import Button from "../ui/Button";
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
    const [currentPage, setCurrentPage] = useState(1);
    const transactionsPerPage = 20;

    const list: Transaction[] = Array.isArray(rows) ? rows : [];
    const cats: Category[] = Array.isArray(categories) ? categories : [];

    const catById = Object.fromEntries(cats.map((c) => [c.id, c]));

    // Pagination logic
    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction =
        indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = list.slice(
        indexOfFirstTransaction,
        indexOfLastTransaction
    );

    const totalPages = Math.ceil(list.length / transactionsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <Card>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="text-left px-4 py-2">Date/Time</th>
                            <th className="text-left px-4 py-2">Type</th>
                            <th className="text-left px-4 py-2">Category</th>
                            <th className="text-right px-4 py-2">Amount</th>
                            <th className="text-left px-4 py-2">Note</th>
                            <th className="text-right px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTransactions.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-6 text-center text-slate-500"
                                >
                                    No transactions yet
                                </td>
                            </tr>
                        ) : (
                            currentTransactions.map((r) => (
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
                                        {catById[
                                            (r as any).category ??
                                                (r as any).categoryId
                                        ]?.name ?? "—"}
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        {money(r.amount)}
                                    </td>
                                    <td className="px-4 py-2">
                                        {r.note ?? ""}
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => onEdit(r)}
                                                className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-slate-50"
                                                title="Edit"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onDelete(r.id)}
                                                className="inline-flex items-center rounded-lg border border-rose-200 px-3 py-1.5 text-rose-600 hover:bg-rose-50"
                                                title="Delete"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {totalPages > 1 && (
                <div className="flex items-center justify-end gap-2 p-4 border-t bg-slate-50">
                    <span className="text-sm text-slate-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        label="Previous"
                        variant="primary"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="py-1.5"
                    />
                    <Button
                        label="Next"
                        variant="primary"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={
                            currentPage === totalPages ||
                            currentTransactions.length < transactionsPerPage
                        }
                        className="py-1.5"
                    />
                </div>
            )}
        </Card>
    );
}
