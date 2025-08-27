import axios from "axios";
import { API_BASE } from "./api";

export const createTransaction = async (
    type: "income" | "expense",
    categoryId: string,
    amount: number,
    note?: string,
    datetime?: string
) => {
    return await axios.post(`${API_BASE}/transaction`, { type, categoryId, amount, note, datetime });
};

export const getTransactionById = async (id: string) => {
    return await axios.get(`${API_BASE}/transaction/${id}`);
};

export const updateTransaction = async (
    id: string,
    type?: "income" | "expense",
    categoryId?: string,
    amount?: number,
    note?: string,
    datetime?: string
) => {
    return await axios.put(`${API_BASE}/transaction/${id}`, { name, type, categoryId, amount, note, datetime });
};

export const deleteTransaction = async (id: string) => {
    return await axios.delete(`${API_BASE}/transaction/${id}`);
};
