import { addCustomerSchema } from "@/schemas/customers/addCustomerSchema";
import { z } from "zod";

export type CustomerInputType = z.infer<typeof addCustomerSchema>;

export interface CustomerData {
    id: string;
    name: string;
    address: string;
    zip_code: string;
    city: string;
    state: string;
    website: string;
    phone_number: string;
    customers: { id: string }[];
    _count: { customers: number };
  }