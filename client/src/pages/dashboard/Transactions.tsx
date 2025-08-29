// dashboard/transactions.tsx
import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import AddTransactionForm from "../../components/forms/AddTransactionForm";
import EditTransactionForm from "../../components/forms/EditTransactionForm"; // ⬅️ new
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
        // Always keep a clean categoryId string, no mixed object:
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

    useEffect(() => {
        (async () => {
            try {
                const [txRes, catRes] = await Promise.all([
                    getTransactionAll(),
                    getCategoryAll(),
                ]);
                setTransactions(normalizeTransactions(toArray(txRes.data)));
                setCategories(normalizeCategories(toArray(catRes.data)));
            } catch {
                toast.error("Failed to load data");
            }
        })();
    }, []);

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

            <TransactionTable
                rows={transactions}
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
                            // ensure string id even if something odd:
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
