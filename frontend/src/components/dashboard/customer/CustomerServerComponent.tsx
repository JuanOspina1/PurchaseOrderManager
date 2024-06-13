import axios from 'axios';

import { ApiResponse } from '@/types/api-response';
import { useAxiosServer } from '@/hooks/useAxiosServer';

interface Customer {
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

export async function fetchCustomers() {
  const client = useAxiosServer();
  try {
    const res = await client.get<ApiResponse<Customer[]>>('http://localhost:5000/user_company');
    const customersData: Customer[] = res.data.data.map((customerCompany) => ({
      id: customerCompany.id,
      name: customerCompany.name,
      email: '', // Assuming no email in the response, you can adjust this if needed
      address: customerCompany.address,
      city: customerCompany.city,
      state: customerCompany.state,
      zip_code: customerCompany.zip_code,
      phone_number: customerCompany.phone_number.toString(),
      website: customerCompany.website,
      customers: customerCompany.customers,
      _count: customerCompany._count,
      createdAt: new Date(), // Assuming current date as createdAt, adjust if needed
    }));

    return customersData;
  } catch (err) {
    console.error(err);
    return [];
  }
}
