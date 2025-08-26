import axios from "axios";
import { API_BASE } from "./api";


export const getUserData = () => {
    return axios.get(`${API_BASE}/me`, { withCredentials: true });
};
