import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAxios } from "../useAxios"
import { CustomerInputType } from "@/types/customer.type";

export const useAddCustomer = () => {
    const client = useAxios();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data : CustomerInputType) => {
            await client.post('/customer_company', data) 
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["customers"]
            })
        }
    })
}