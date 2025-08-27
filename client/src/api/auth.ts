import axios from "axios";
import { API_BASE } from "./api";

export const sendVerificationCode = async (email: string) => {
    return await axios.post(`${API_BASE}/auth/send-code`, { email });
};

export const registerUser = async (email: string, password: string, code: string) => {
    return await axios.post(`${API_BASE}/auth/register`, { email, password, code });
};

export const loginUser = async (email: string, password: string) => {
    return await axios.post(
        `${API_BASE}/auth/login`,
        { email, password },
        { withCredentials: true }
    );
};

export const sendResetCode = async (email: string) => {
    return await axios.post(`${API_BASE}/auth/send-reset-code`, { email });
};

export const checkCode = async (email: string, code: string, type: "register" | "reset") => {
    return await axios.post(`${API_BASE}/auth/check-code`, { email, code, type });
};

export const me = async () => {
    return await axios.get(`${API_BASE}/auth/me`, { withCredentials: true });
};

export const resetPassword = async (
    email: string,
    code: string,
    newPassword: string
) => {
    return await axios.post(`${API_BASE}/auth/reset-password`, {
        email,
        code,
        newPassword,
    });
};
