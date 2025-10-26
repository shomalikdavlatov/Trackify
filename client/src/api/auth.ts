import { api } from "./api";

export const registerAPI = async (email: string, currency: string, password: string, code: string) => {
    return await api.post(`/auth/register`, { email, currency, password, code });
};

export const resetPasswordAPI = async (
    email: string,
    code: string,
    newPassword: string
) => {
    return await api.post(`/auth/reset-password`, {
        email,
        code,
        newPassword,
    });
};

export const loginAPI = async (email: string, password: string) => {
    return await api.post(
        `/auth/login`,
        { email, password },
    );
};

export const logoutAPI = async () => {
    await api.post(`/auth/logout`);
}

export const sendCodeAPI = async (email: string, type: "Register" | "Reset") => {
    return await api.post(`/auth/send-code`, { email, type });
};

export const verifyCodeAPI = async (email: string, code: string, type: "Register" | "Reset") => {
    return await api.post(`/auth/verify-code`, { email, code, type });
};

export const me = async () => {
    return await api.get(`/auth/me`);
};

