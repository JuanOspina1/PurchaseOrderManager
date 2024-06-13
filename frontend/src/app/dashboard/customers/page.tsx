'use client';

import * as React from 'react';

import { fetchCustomers } from '@/lib/fetchCustomers';
import { setupAxiosForServer } from '@/lib/setupAxiosForServer';
import { useUser } from '@/hooks/use-user';
import { useRefreshToken } from '@/hooks/useRefreshToken';
import CustomerClientComponent from '@/components/dashboard/customer/CustomerClientComponent';

export default async function Page() {
  const { accessToken, setIsLoading } = useUser();
  const refresh = useRefreshToken();

  const axiosInstance = await setupAxiosForServer(accessToken, refresh, setIsLoading);
  const customers = await fetchCustomers(axiosInstance);

  return <CustomerClientComponent customers={customers} />;
}
