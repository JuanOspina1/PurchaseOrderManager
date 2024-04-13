import { UserContext } from "@/contexts/user-context"
import { client } from "@/lib/axios"
import { useContext, useEffect } from "react"
import { useRefreshToken } from "./useRefreshToken";

export const useAxios = () => {
    const userContext = useContext(UserContext);
    const refresh = useRefreshToken();

    useEffect(() =>{
        const reqInterceptor = client.interceptors.request.use(
            config => {
                if(!config.headers["Authorization"]) {

                    config.headers["Authorization"] = `Bearer ${userContext?.user.accessToken}`
                }

                return config;
            }, err => Promise.reject(err)
        )

       const resInterceptor = client.interceptors.response.use(
        res => res,
        async (err) => {
            const prevRequest = err?.config;

            if(err?.config?.status === 401 && !prevRequest?.sent) {
                prevRequest.sent = true;
                const token = await refresh();


                if(token !== undefined && token.length > 0) {
                    prevRequest.headers["Authorization"] = `Bearer ${token}`;
                    userContext?.setIsLoading(false);
                    return client(prevRequest);
                }
            }

            userContext?.setIsLoading(false);
            return Promise.reject(err);
        }
       ) 

       return () => {
        client.interceptors.request.eject(reqInterceptor);
        client.interceptors.response.eject(resInterceptor);
       }
    }, [])

    return client;
}