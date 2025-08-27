import axios from "axios";
import { API_BASE } from "./api";


export const getUserData = async () => {
    return await axios.get(`${API_BASE}/me`, { withCredentials: true });
};
