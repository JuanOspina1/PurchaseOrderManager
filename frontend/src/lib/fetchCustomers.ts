// lib/fetchCustomers.ts
import axios from 'axios';

import { ApiResponse } from '@/types/api-response';

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

export const fetchCustomers = async (accessToken: string): Promise<Customer[]> => {
  try {
    const res = await axios.get<ApiResponse<Customer[]>>('http://localhost:5000/customer_company', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

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
};
