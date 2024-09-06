import { useQuery } from "@tanstack/react-query"
import { useAxios } from "../useAxios"
import { PaginationState } from "@tanstack/react-table";
import { PageList } from "@/types/page-list";
import { CustomerData } from "@/types/customer.type";

export const useGetPaginatedCustomers = (pagination : PaginationState, searchQuery? : string) => {
    const client = useAxios();

    return useQuery({
        queryFn: async () => {
            let url = `/customer_company?limit=${pagination.pageSize}&page=${pagination.pageIndex + 1}`;
            if (searchQuery !== undefined && searchQuery.length > 0) {
                url += `&search=${searchQuery}`
            }
            const res = await client.get<PageList<CustomerData[]>>(url)
            return res.data;
        },
        queryKey: ["customers", {pagination, searchQuery}]
    })
}