// dashboard/dashboard.tsx
import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import StatsCards from "../../components/dashboard/StatsCards";
import MonthlyBarChart from "../../components/charts/MonthlyBarChart";
import TypePieChart from "../../components/charts/TypePieChart";
import DailyLineChart from "../../components/charts/DailyLineChart";
import Modal from "../../components/ui/Modal";
import AddTransactionForm from "../../components/forms/AddTransactionForm";
import useModal from "../../hooks/useModal";
import { type Transaction } from "../../types";
import { toast } from "react-toastify";
import { createTransaction, getTransactionAll } from "../../api/transaction";
import TopThisMonth from "../../components/dashboard/TopThisMonth";
import DailyBalanceHeatmap from "../../components/charts/DailyBalanceHeatmap";

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

export default function Dashboard() {
    const txModal = useModal(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [categoryFilter, setCategoryFilter] = useState<
        "all" | "income" | "expense"
    >("all");

    useEffect(() => {
        (async () => {
            try {
                const txRes = await getTransactionAll();
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

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setYear(Number(e.target.value));
    };

    const handleCategoryFilterChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setCategoryFilter(e.target.value as "all" | "income" | "expense");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <Button onClick={txModal.onOpen}>+ Add Transaction</Button>
            </div>

            <StatsCards data={transactions} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-1 lg:col-span-2 p-5">
                    <DailyLineChart data={transactions} />
                </Card>

                <Card className="p-5">
                    <div className="font-medium mb-3">Income vs Expense</div>
                    <TypePieChart data={transactions} />
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-2 p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="font-medium">Monthly Overview</div>
                        <select
                            value={categoryFilter}
                            onChange={handleCategoryFilterChange}
                            className="border rounded-lg px-2 py-1 text-sm"
                        >
                            <option value="all">All</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>
                    <MonthlyBarChart
                        data={transactions}
                        categoryFilter={categoryFilter}
                    />
                </Card>

                <TopThisMonth data={transactions} />
            </div>

            <DailyBalanceHeatmap
                data={transactions}
                year={year}
                onYearChange={handleYearChange}
            />

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
