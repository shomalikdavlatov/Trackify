import { api } from "./api";

export const sendVerificationCode = async (email: string) => {
    return await api.post(`/auth/send-code`, { email });
};

export const registerUser = async (email: string, password: string, code: string) => {
    return await api.post(`/auth/register`, { email, password, code });
};

export const loginUser = async (email: string, password: string) => {
    return await api.post(
        `/auth/login`,
        { email, password },
    );
};

export const sendResetCode = async (email: string) => {
    return await api.post(`/auth/send-reset-code`, { email });
};

export const checkCode = async (email: string, code: string, type: "register" | "reset") => {
    return await api.post(`/auth/check-code`, { email, code, type });
};

export const me = async () => {
    return await api.get(`/auth/me`);
};

export const resetPassword = async (
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
