'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode, useState } from "react"

const QueryProvider = ({children} : {children : ReactNode}) => {
    // we can add some config in here just in case
    // like stale time and refetching options
    const [queryClient] = useState(() => new QueryClient())
    
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

export default QueryProvider;