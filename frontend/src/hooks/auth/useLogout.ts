import { useMutation } from "@tanstack/react-query"
import { useAxios } from "../useAxios"
import { useRouter } from "next/navigation";
import { useUser } from "../use-user";
import { User } from "@/types/user";

export const useLogout = () => {
    const { setAccessToken, setDetails } = useUser();
    const client = useAxios();
    const router = useRouter();

    return useMutation({
        mutationFn: async () => {
            await client.post('/logout')
        },
        onSuccess: () => {
            setAccessToken("");
            setDetails({} as User)
            
            router.replace('/auth/sign-in')
        },
        onError: () => {
            // TODO: log or show it to the user whats the error
            // probably use a toast to display a server error?
        }
    })
}