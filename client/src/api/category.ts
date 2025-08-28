import { api } from "./api";

export const createCategory = async (name: string, type: "income" | "expense") => {
    return await api.post(`/category`, {name, type});
}

export const getCategoryAll= async () => {
    return await api.get(`/category`);
}

export const getCategoryById = async (id: string,) => {
    return await api.get(`/category/${id}`);
}

export const updateCategory = async (id: string, name?: string, type?: "income" | "expense") => {
    return await api.put(`/category/${id}`, {name, type});
}

export const deleteCategory = async (id: string) => {
    return await api.delete(`/category/${id}`);
}