import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import AddTransactionForm from "../../components/forms/AddTransactionForm";
import TransactionTable from "../../components/tables/TransactionTable";
import useModal from "../../hooks/useModal";
import { type Category, type Transaction } from "../../types";
import { toast } from "react-toastify";

const categories: Category[] = [
    { id: "c1", name: "Salary", type: "income" },
    { id: "c3", name: "Food", type: "expense" },
];
const rows: Transaction[] = [
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
];

export default function Transactions() {
    const modal = useModal(false);
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Transactions</h1>
                <Button onClick={modal.onOpen}>+ Add Transaction</Button>
            </div>
            <TransactionTable rows={rows} categories={categories} />

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
                <AddTransactionForm
                    categories={categories}
                    onSubmit={(payload) => {
                        // TODO: call create transaction API
                        console.log("Create Tx", payload);
                        toast.success("Transaction created (mock)");
                        modal.onClose();
                    }}
                />
            </Modal>
        </div>
    );
}
