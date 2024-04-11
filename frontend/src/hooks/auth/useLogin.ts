import { SignInWithPasswordParams } from "@/lib/auth/client"
import axios from "@/lib/axios"
import { useMutation } from "@tanstack/react-query"
import { useUser } from "../use-user";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const { checkSession } = useUser();
  const router = useRouter();

    return useMutation({
        mutationFn: async (input : SignInWithPasswordParams) => {
            const res = await axios.post('/login', input);

            return res.data;
        },
        onSuccess: async () => {
            await checkSession?.();

            router.refresh();
        }
    })
}