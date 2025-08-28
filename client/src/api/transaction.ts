import { api } from "./api";

export const createTransaction = async (
    type: "income" | "expense",
    categoryId: string,
    amount: number,
    note?: string,
    datetime?: string
) => {
    return await api.post(`/transaction`, { type, categoryId, amount, note, datetime });
};

export const getTransactionAll = async () => {
    return await api.get(`/transaction`);
};

export const getTransactionById = async (id: string) => {
    return await api.get(`/transaction/${id}`);
};

export const updateTransaction = async (
    id: string,
    type?: "income" | "expense",
    categoryId?: string,
    amount?: number,
    note?: string,
    datetime?: string
) => {
    return await api.put(`/transaction/${id}`, { name, type, categoryId, amount, note, datetime });
};

export const deleteTransaction = async (id: string) => {
    return await api.delete(`/transaction/${id}`);
};
