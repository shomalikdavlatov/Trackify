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

const mockCategories: Category[] = [
    { id: "c1", name: "Salary", type: "income" },
    { id: "c2", name: "Freelance", type: "income" },
    { id: "c3", name: "Food", type: "expense" },
    { id: "c4", name: "Transport", type: "expense" },
];

const mockTx: Transaction[] = [
    {
        id: "t1",
        type: "income",
        categoryId: "c1",
        amount: 1200,
        datetime: new Date().toISOString(),
    },
    {
        id: "t2",
        type: "expense",
        categoryId: "c3",
        amount: 200,
        note: "Lunch",
        datetime: new Date().toISOString(),
    },
    {
        id: "t3",
        type: "income",
        categoryId: "c2",
        amount: 400,
        datetime: new Date(Date.now() - 864e5 * 20).toISOString(),
    },
    {
        id: "t4",
        type: "expense",
        categoryId: "c4",
        amount: 50,
        datetime: "2025-07-26T09:53:00.123Z",
    },
    {
        id: "t5",
        type: "income",
        categoryId: "c2",
        amount: 400,
        datetime: "2025-07-26T09:53:00.123Z",
    },
    {
        id: "t6",
        type: "expense",
        categoryId: "c4",
        amount: 50,
        datetime: "2025-07-26T09:53:00.123Z",
    },
];

export default function Dashboard() {
    const txModal = useModal(false);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <Button onClick={txModal.onOpen}>+ Add Transaction</Button>
            </div>

            <StatsCards data={mockTx} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-2 p-5">
                    <div className="font-medium mb-3">Monthly Overview</div>
                    <MonthlyBarChart data={mockTx} />
                </Card>
                <Card className="p-5">
                    <div className="font-medium mb-3">Income vs Expense</div>
                    <TypePieChart data={mockTx} />
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
                <AddTransactionForm
                    categories={mockCategories}
                    onSubmit={(payload) => {
                        // TODO: call create transaction API
                        console.log("Create Tx", payload);
                        toast.success("Transaction created (mock)");
                        txModal.onClose();
                    }}
                />
            </Modal>
        </div>
    );
}
