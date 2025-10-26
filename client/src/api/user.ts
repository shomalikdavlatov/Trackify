import { api } from "./api";

export const getUserData = async () => {
    return await api.get(`/user`);
};

export const changePassword = async (
    oldPassword: string,
    newPassword: string
) => {
    return await api.put("/user/change-password", { oldPassword, newPassword });
};

export const changeCurrency = async (currency: string) => {
    return await api.put("/user/change-currency", { currency });
};
