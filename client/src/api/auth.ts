import axios from "axios";
import { API_BASE } from "./api";

export const sendVerificationCode = (email: string) => {
    return axios.post(`${API_BASE}/auth/send-code`, { email });
};

export const registerUser = (email: string, password: string, code: string) => {
    return axios.post(`${API_BASE}/auth/register`, { email, password, code });
};

export const loginUser = (email: string, password: string) => {
    return axios.post(
        `${API_BASE}/auth/login`,
        { email, password },
        { withCredentials: true }
    );
};

export const sendResetCode = (email: string) => {
    return axios.post(`${API_BASE}/auth/send-reset-code`, { email });
};

export const checkCode = (email: string, code: string, type: "register" | "reset") => {
    return axios.post(`${API_BASE}/auth/check-code`, { email, code, type });
};

export const me = () => {
    return axios.get(`${API_BASE}/auth/me`, { withCredentials: true });
};

export const resetPassword = (
    email: string,
    code: string,
    newPassword: string
) => {
    return axios.post(`${API_BASE}/auth/reset-password`, {
        email,
        code,
        newPassword,
    });
};
