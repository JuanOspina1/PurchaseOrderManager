import axios from "@/lib/axios"
import { AuthResponse } from '@/types/auth/AuthResponse'
import { isAxiosError } from "axios";

export const useRefreshToken = () => {
    const refresh = async () => {

        try {
            const res = await axios.get<AuthResponse>('/refresh', { withCredentials: true })

            return res.data.accessToken;
        } catch (err) {
            if (isAxiosError(err) && err.response?.status === 401) {
                return "";
            }
        }
    }
    return refresh
}