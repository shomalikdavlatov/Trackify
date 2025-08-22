import axios from "axios";

export const API_BASE = "http://localhost:4000/api";

export const getUserData = () => {
    return axios.get(`${API_BASE}/me`, { withCredentials: true });
};
