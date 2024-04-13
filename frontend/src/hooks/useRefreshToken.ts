import axios from "@/lib/axios"
import { AuthResponse } from '@/types/auth/AuthResponse'
import { isAxiosError } from "axios";
import { useUser } from "./use-user";

export const useRefreshToken = () => {
    const {setAccessToken, setDetails} = useUser();
    const refresh = async () => {

        try {
            const res = await axios.get<AuthResponse>('/refresh', { withCredentials: true })

            setAccessToken(res.data.accessToken);
            setDetails(res.data.data);

            return res.data.accessToken;
        } catch (err) {
            if (isAxiosError(err) && err.response?.status === 401) {
                return "";
            }
        }
    }
    return refresh
}