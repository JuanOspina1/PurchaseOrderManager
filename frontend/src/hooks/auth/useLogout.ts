import { useMutation } from "@tanstack/react-query"
import { useAxios } from "../useAxios"
import { useUser } from "../use-user";
import { User } from "@/types/user";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";

export const useLogout = () => {
    const client = useAxios();
    const {setAccessToken, setDetails, setError} = useUser();
    const router = useRouter();

    return useMutation({
        mutationFn : async () => {
            await client.post('/logout');
        },
        onSuccess: () => {
            setAccessToken("")
            setDetails({} as User)

            router.push('/auth/sign-in')
        },
        onError: (err) => {
            if(isAxiosError(err)) {
                setError(err.message)
            }
        }
    })
}