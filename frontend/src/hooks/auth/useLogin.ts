import { SignInWithPasswordParams } from "@/lib/auth/client"
import axios from "@/lib/axios"
import { useMutation } from "@tanstack/react-query"
import { useUser } from "../use-user";
import { useRouter } from "next/navigation";
import { AuthResponse } from "@/types/auth/AuthResponse";

export const useLogin = () => {
  const { setAccessToken, setDetails} = useUser();
  const router = useRouter();

    return useMutation({
        mutationFn: async (input : SignInWithPasswordParams) => {
            const res = await axios.post<AuthResponse>('/login', input, {withCredentials : true});

            return res.data;
        },
        onSuccess: async ({accessToken, data}) => {
            // await checkSession?.();
            setAccessToken(accessToken)
            setDetails(data);
            router.push('/dashboard')
        }
    })
}