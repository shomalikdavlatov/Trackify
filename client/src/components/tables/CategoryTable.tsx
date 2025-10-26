import { useState } from "react";
import Card from "../ui/Card";
import { type Category } from "../../types";
import { updateCategory, deleteCategory } from "../../api/category";
import { toast } from "react-toastify";

export default function CategoryTable({
    rows,
    onUpdated,
    onDeleted,
}: {
    rows: Category[];
    onUpdated?: (updated: Category) => void | Promise<void>;
    onDeleted?: (id: string) => void | Promise<void>;
}) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [nameDraft, setNameDraft] = useState("");
    const [savingId, setSavingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [overrides, setOverrides] = useState<Map<string, string>>(new Map());
    const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());

    const visibleRows = rows.filter((r) => !hiddenIds.has(r.id));

    const startEdit = (r: Category) => {
        setEditingId(r.id);
        setNameDraft(overrides.get(r.id) ?? r.name);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setNameDraft("");
    };

    const saveEdit = async (r: Category) => {
        if (!nameDraft.trim()) {
            toast.error("Name is required");
            return;
        }
        try {
            setSavingId(r.id);
            const res = await updateCategory(r.id, nameDraft.trim());
            const updatedRaw = (res as any).data?.data ??
                (res as any).data ?? {
                    ...r,
                    name: nameDraft.trim(),
                };
            const updated: Category = {
                id: updatedRaw.id ?? updatedRaw._id ?? r.id,
                name: updatedRaw.name ?? nameDraft.trim(),
                type: updatedRaw.type ?? r.type,
            };

            setOverrides((prev) => {
                const next = new Map(prev);
                next.set(r.id, updated.name);
                return next;
            });

            if (onUpdated) await onUpdated(updated);

            toast.success("Category updated");
            cancelEdit();
        } catch {
            toast.error("Failed to update category");
        } finally {
            setSavingId(null);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await deleteCategory(id);

            setHiddenIds((prev) => new Set(prev).add(id));

            if (onDeleted) await onDeleted(id);

            toast.success("Category deleted");
        } catch {
            toast.error("Failed to delete category");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <Card className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="text-left px-4 py-2">Name</th>
                            <th className="text-left px-4 py-2">Type</th>
                            <th className="text-right px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleRows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="px-4 py-6 text-center text-slate-500"
                                >
                                    No categories
                                </td>
                            </tr>
                        ) : (
                            visibleRows.map((r) => {
                                const isEditing = editingId === r.id;
                                const displayName =
                                    overrides.get(r.id) ?? r.name;

                                return (
                                    <tr
                                        key={r.id}
                                        className="odd:bg-white even:bg-slate-50"
                                    >
                                        <td className="px-4 py-2">
                                            {isEditing ? (
                                                <input
                                                    value={nameDraft}
                                                    onChange={(e) =>
                                                        setNameDraft(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="border rounded-xl px-3 py-2 w-full"
                                                    autoFocus
                                                />
                                            ) : (
                                                displayName
                                            )}
                                        </td>
                                        <td className="px-4 py-2 capitalize">
                                            {r.type}
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center justify-end gap-2">
                                                {isEditing ? (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                saveEdit(r)
                                                            }
                                                            disabled={
                                                                savingId ===
                                                                r.id
                                                            }
                                                            className="inline-flex items-center rounded-lg px-3 py-1.5 text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                                                            title="Save"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={cancelEdit}
                                                            className="inline-flex items-center rounded-lg px-3 py-1.5 border border-slate-200 hover:bg-slate-50"
                                                            title="Cancel"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                startEdit(r)
                                                            }
                                                            className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-slate-50"
                                                            title="Edit"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    r.id
                                                                )
                                                            }
                                                            disabled={
                                                                deletingId ===
                                                                r.id
                                                            }
                                                            className="inline-flex items-center rounded-lg border border-rose-200 px-3 py-1.5 text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                                                            title="Delete"
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
