import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import StatsCards from "../../components/dashboard/StatsCards";
import MonthlyBarChart from "../../components/charts/MonthlyBarChart";
import TypePieChart from "../../components/charts/TypePieChart";
import Modal from "../../components/ui/Modal";
import AddTransactionForm from "../../components/forms/AddTransactionForm";
import useModal from "../../hooks/useModal";
import { type Transaction, type Category } from "../../types";
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

export default function Dashboard() {
    const txModal = useModal(false);

    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const txRes = await getTransactionAll()

                setTransactions(normalizeTransactions(toArray(txRes.data)));
            } catch {
                toast.error("Failed to load dashboard data");
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
            txModal.onClose();
        } catch {
            toast.error("Failed to create transaction");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <Button onClick={txModal.onOpen}>+ Add Transaction</Button>
            </div>

            <StatsCards data={transactions} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-2 p-5">
                    <div className="font-medium mb-3">Monthly Overview</div>
                    <MonthlyBarChart data={transactions} />
                </Card>
                <Card className="p-5">
                    <div className="font-medium mb-3">Income vs Expense</div>
                    <TypePieChart data={transactions} />
                </Card>
            </div>

            <Modal
                open={txModal.open}
                title="Add Transaction"
                onClose={txModal.onClose}
                footer={
                    <Button onClick={txModal.onClose} variant="ghost">
                        Close
                    </Button>
                }
            >
                <AddTransactionForm onSubmit={handleCreateTx} />
            </Modal>
        </div>
    );
}
