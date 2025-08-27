import axios from "axios";
import { API_BASE } from "./api";

export const createCategory = async (name: string, type: "income" | "expense") => {
    return await axios.post(`${API_BASE}/category`, {name, type});
}

export const getCategoryById = async (id: string,) => {
    return await axios.get(`${API_BASE}/category/${id}`);
}

export const updateCategory = async (id: string, name?: string, type?: "income" | "expense") => {
    return await axios.put(`${API_BASE}/category/${id}`, {name, type});
}

export const deleteCategory = async (id: string) => {
    return await axios.delete(`${API_BASE}/category/${id}`);
}