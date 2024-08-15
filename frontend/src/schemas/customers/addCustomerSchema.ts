import { z } from "zod";

export const addCustomerSchema = z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zip_code: z.string().min(1),
    phone_number: z.string().min(1),
    website: z.string().min(1)
})