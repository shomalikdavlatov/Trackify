import { api } from "./api";

export const getUserData = async () => {
    return await api.get(`/me`);
};
