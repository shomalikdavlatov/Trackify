// dashboard/transactions.tsx
import { useEffect, useState, useMemo } from "react";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import AddTransactionForm from "../../components/forms/AddTransactionForm";
import EditTransactionForm from "../../components/forms/EditTransactionForm";
import TransactionTable from "../../components/tables/TransactionTable";
import useModal from "../../hooks/useModal";
import { type Category, type Transaction } from "../../types";
import { toast } from "react-toastify";
import {
    createTransaction,
    getTransactionAll,
    updateTransaction,
    deleteTransaction,
} from "../../api/transaction";
import { getCategoryAll } from "../../api/category";

function toArray<T>(resData: any): T[] {
    if (Array.isArray(resData)) return resData as T[];
    if (Array.isArray(resData?.data)) return resData.data as T[];
    if (Array.isArray(resData?.items)) return resData.items as T[];
    return [];
}

function normalizeTransactions(raw: any[]): Transaction[] {
    return raw.map((t: any) => ({
        id: t.id ?? t._id ?? String(t.id ?? t._id),
        type: t.type,
        category: t.category,
        amount: Number(t.amount) || 0,
        note: t.note ?? undefined,
        datetime: new Date(
            t.datetime ?? t.date ?? t.createdAt ?? Date.now()
        ).toISOString(),
    }));
}

function normalizeCategories(raw: any[]): Category[] {
    return raw.map((c: any) => ({
        id: c.id ?? c._id ?? String(c.id ?? c._id),
        name: c.name,
        type: c.type,
    }));
}

export default function Transactions() {
    const addModal = useModal(false);
    const editModal = useModal(false);

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [editing, setEditing] = useState<Transaction | null>(null);

    // ---------------- FILTER STATE ----------------
    const [filterStartDate, setFilterStartDate] = useState<string>("");
    const [filterEndDate, setFilterEndDate] = useState<string>("");
    const [filterCategory, setFilterCategory] = useState<string | null>(null);
    const [filterNote, setFilterNote] = useState<string>("");
    const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
        "all"
    );

    // ---------------- SORT STATE ----------------
    const [sortBy, setSortBy] = useState<"date" | "amount">("date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    useEffect(() => {
        (async () => {
            try {
                const [txRes, catRes] = await Promise.all([
                    getTransactionAll(),
                    getCategoryAll(),
                ]);
                const normalizedCats = normalizeCategories(
                    toArray(catRes.data)
                );
                setCategories(normalizedCats);
                setTransactions(normalizeTransactions(toArray(txRes.data)));
            } catch {
                toast.error("Failed to load data");
            }
        })();
    }, []);

    // -------------- FILTERED & SORTED TRANSACTIONS --------------
    const filteredTransactions = useMemo(() => {
        let filtered = transactions.filter((t) => {
            // Filter by start date
            if (
                filterStartDate &&
                new Date(t.datetime) < new Date(filterStartDate)
            )
                return false;

            // Filter by end date
            if (filterEndDate && new Date(t.datetime) > new Date(filterEndDate))
                return false;

            // Filter by categories
            if (
                filterCategory &&
                filterCategory !== String(t.category)
            )
                return false;

            // Filter by note
            if (
                filterNote &&
                !(t.note ?? "").toLowerCase().includes(filterNote.toLowerCase())
            )
                return false;

            // Filter by type
            if (filterType !== "all" && t.type !== filterType) return false;

            return true;
        });

        // Sorting
        filtered.sort((a, b) => {
            let comp = 0;
            if (sortBy === "date") {
                comp =
                    new Date(a.datetime).getTime() -
                    new Date(b.datetime).getTime();
            } else if (sortBy === "amount") {
                comp = a.amount - b.amount;
            }

            return sortOrder === "asc" ? comp : -comp;
        });

        return filtered;
    }, [
        transactions,
        filterStartDate,
        filterEndDate,
        filterCategory,
        filterNote,
        filterType,
        sortBy,
        sortOrder,
    ]);

    // ---------- HANDLERS ----------
    const handleCreateTx = async (payload: {
        type: "income" | "expense";
        categoryId: string;
        amount: number;
        note?: string;
        datetime: string;
    }) => {
        try {
            const res = await createTransaction(
                payload.type,
                payload.categoryId,
                payload.amount,
                payload.note,
                payload.datetime
            );
            const createdRaw = (res.data?.data ?? res.data) as any;
            const [created] = normalizeTransactions([createdRaw]);
            setTransactions((prev) => [...prev, created]);
            toast.success("Transaction created");
            addModal.onClose();
        } catch {
            toast.error("Failed to create transaction");
        }
    };

    const openEdit = (tx: Transaction) => {
        setEditing(tx);
        editModal.onOpen();
    };

    const handleUpdateTx = async (values: {
        type: "income" | "expense";
        categoryId: string;
        amount: number;
        note?: string;
        datetime: string;
    }) => {
        if (!editing) return;
        try {
            const res = await updateTransaction(
                editing.id,
                values.type,
                values.categoryId,
                values.amount,
                values.note,
                values.datetime
            );
            const updatedRaw = (res.data?.data ?? res.data) as any;
            const [updated] = normalizeTransactions([updatedRaw]);

            setTransactions((prev) =>
                prev.map((t) => (t.id === editing.id ? updated : t))
            );
            toast.success("Transaction updated");
            setEditing(null);
            editModal.onClose();
        } catch {
            toast.error("Failed to update transaction");
        }
    };

    const handleDeleteTx = async (id: string) => {
        try {
            await deleteTransaction(id);
            setTransactions((prev) => prev.filter((t) => t.id !== id));
            toast.success("Transaction deleted");
        } catch {
            toast.error("Failed to delete transaction");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Transactions</h1>
                <Button onClick={addModal.onOpen}>+ Add Transaction</Button>
            </div>

            {/* --------------- FILTER & SORT UI ---------------- */}
            <div className="flex flex-nowrap gap-1 items-end">
                {/* Start Date */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium">Start Date</label>
                    <input
                        type="date"
                        value={filterStartDate}
                        onChange={(e) => setFilterStartDate(e.target.value)}
                        className="border px-[6px] py-2 h-10 rounded"
                    />
                </div>

                {/* End Date */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium">End Date</label>
                    <input
                        type="date"
                        value={filterEndDate}
                        onChange={(e) => setFilterEndDate(e.target.value)}
                        className="border px-[6px] py-2 h-10 rounded"
                    />
                </div>

                {/* Category */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium">Category</label>
                    <select
                        value={filterCategory || "all"}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === "all") setFilterCategory(null);
                            else setFilterCategory(value);
                        }}
                        className="border px-[6px] py-2 h-10 rounded max-w-[148px] min-w-[120px]"
                    >
                        <option value="all">All</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Type */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium">Type</label>
                    <select
                        value={filterType}
                        onChange={(e) =>
                            setFilterType(
                                e.target.value as "all" | "income" | "expense"
                            )
                        }
                        className="border px-[6px] py-2 h-10 rounded"
                    >
                        <option value="all">All</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>

                {/* Note */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium">Note</label>
                    <input
                        type="text"
                        placeholder="Search note..."
                        value={filterNote}
                        onChange={(e) => setFilterNote(e.target.value)}
                        className="border px-[6px] py-2 h-10 rounded w-[140px]"
                    />
                </div>

                {/* Sort By */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium">Sort By</label>
                    <select
                        value={sortBy}
                        onChange={(e) =>
                            setSortBy(e.target.value as "date" | "amount")
                        }
                        className="border px-[6px] py-2 h-10 rounded"
                    >
                        <option value="date">Date</option>
                        <option value="amount">Amount</option>
                    </select>
                </div>

                {/* Sort Order */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium">Order</label>
                    <select
                        value={sortOrder}
                        onChange={(e) =>
                            setSortOrder(e.target.value as "asc" | "desc")
                        }
                        className="border px-[6px] py-2 h-10 rounded"
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>

                {/* Clear Filters */}
                <div className="flex flex-col justify-end flex-1">
                    <Button
                        variant="danger"
                        onClick={() => {
                            setFilterStartDate("");
                            setFilterEndDate("");
                            setFilterCategory(null);
                            setFilterNote("");
                            setFilterType("all");
                            setSortBy("date");
                            setSortOrder("desc");
                        }}
                        className="h-10"
                    >
                        Clear Filters
                    </Button>
                </div>
            </div>

            {/* --------------- TRANSACTION TABLE ---------------- */}
            <TransactionTable
                rows={filteredTransactions}
                categories={categories}
                onEdit={openEdit}
                onDelete={handleDeleteTx}
            />

            {/* Add modal */}
            <Modal
                open={addModal.open}
                title="Add Transaction"
                onClose={addModal.onClose}
                footer={
                    <Button onClick={addModal.onClose} variant="ghost">
                        Close
                    </Button>
                }
            >
                <AddTransactionForm onSubmit={handleCreateTx} />
            </Modal>

            {/* Edit modal */}
            <Modal
                open={editModal.open}
                title="Edit Transaction"
                onClose={() => {
                    setEditing(null);
                    editModal.onClose();
                }}
                footer={
                    <Button
                        onClick={() => {
                            setEditing(null);
                            editModal.onClose();
                        }}
                        variant="ghost"
                    >
                        Close
                    </Button>
                }
            >
                {editing && (
                    <EditTransactionForm
                        initial={{
                            type: editing.type,
                            categoryId: String(editing.category ?? ""),
                            amount: editing.amount,
                            note: editing.note ?? "",
                            datetime: editing.datetime,
                        }}
                        onSubmit={handleUpdateTx}
                    />
                )}
            </Modal>
        </div>
    );
}
