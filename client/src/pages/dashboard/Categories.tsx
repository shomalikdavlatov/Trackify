import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import AddCategoryForm from "../../components/forms/AddCategoryForm";
import CategoryTable from "../../components/tables/CategoryTable";
import useModal from "../../hooks/useModal";
import { type Category } from "../../types";
import { toast } from "react-toastify";
import { createCategory, getCategoryAll } from "../../api/category"; 


function toArray<T>(resData: any): T[] {
    if (Array.isArray(resData)) return resData as T[];
    if (Array.isArray(resData?.data)) return resData.data as T[];
    if (Array.isArray(resData?.items)) return resData.items as T[];
    return [];
}

function normalizeCategories(raw: any[]): Category[] {
    return raw.map((c: any) => ({
        id: c.id ?? c._id ?? String(c.id ?? c._id ?? crypto.randomUUID()),
        name: c.name,
        type: c.type,
    }));
}

export default function Categories() {
    const modal = useModal(false);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        getCategoryAll()
            .then((res) => {
                const arr = toArray<any>(res.data);
                setCategories(normalizeCategories(arr));
            })
            .catch(() => toast.error("Failed to load categories"));
    }, []);

    const handleCreateCategory = async (payload: {
        name: string;
        type: "income" | "expense";
    }) => {
        try {
            const res = await createCategory(payload.name, payload.type);
            const createdRaw = (res.data?.data ?? res.data) as any;
            const [created] = normalizeCategories([createdRaw]);
            setCategories((prev) => [...prev, created]);
            toast.success("Category created");
            modal.onClose();
        } catch {
            toast.error("Failed to create category");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Categories</h1>
                <Button onClick={modal.onOpen} label="+ Add Category" />
            </div>

            <CategoryTable rows={categories} />

            <Modal
                open={modal.open}
                title="Add Category"
                onClose={modal.onClose}
                footer={
                    <Button onClick={modal.onClose} variant="ghost" label="Close" />
                }
            >
                <AddCategoryForm onSubmit={handleCreateCategory} />
            </Modal>
        </div>
    );
}
