import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import AddTransactionForm from "../../components/forms/AddTransactionForm";
import TransactionTable from "../../components/tables/TransactionTable";
import useModal from "../../hooks/useModal";
import { type Category, type Transaction } from "../../types";
import { toast } from "react-toastify";
import { createTransaction, getTransactionAll } from "../../api/transaction";
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
        category:
            t.category ??
            t.category_id ??
            t.category?.id ??
            t.category?._id ??
            "",
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
    const modal = useModal(false);

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

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
            modal.onClose();
        } catch {
            toast.error("Failed to create transaction");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Transactions</h1>
                <Button onClick={modal.onOpen}>+ Add Transaction</Button>
            </div>
            <TransactionTable rows={transactions} categories={categories} />

            <Modal
                open={modal.open}
                title="Add Transaction"
                onClose={modal.onClose}
                footer={
                    <Button onClick={modal.onClose} variant="ghost">
                        Close
                    </Button>
                }
            >
                <AddTransactionForm onSubmit={handleCreateTx} />
            </Modal>
        </div>
    );
}
