import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import AddCategoryForm from "../../components/forms/AddCategoryForm";
import CategoryTable from "../../components/tables/CategoryTable";
import useModal from "../../hooks/useModal";
import { type Category } from "../../types";
import { toast } from "react-toastify";

const rows: Category[] = [
    { id: "c1", name: "Salary", type: "income" },
    { id: "c2", name: "Food", type: "expense" },
];

export default function Categories() {
    const modal = useModal(false);
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Categories</h1>
                <Button onClick={modal.onOpen}>+ Add Category</Button>
            </div>
            <CategoryTable rows={rows} />

            <Modal
                open={modal.open}
                title="Add Category"
                onClose={modal.onClose}
                footer={
                    <Button onClick={modal.onClose} variant="ghost">
                        Close
                    </Button>
                }
            >
                <AddCategoryForm
                    onSubmit={(payload) => {
                        // TODO: call create category API
                        console.log("Create Category", payload);
                        toast.success("Category created (mock)");
                        modal.onClose();
                    }}
                />
            </Modal>
        </div>
    );
}
