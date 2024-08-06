import { useContext, useEffect } from 'react';

import { client } from '@/lib/axios';
import { UserContext } from '@/contexts/user-context';

export const useAxiosServer = async (accessToken: string, refresh: () => Promise<string>) => {
  client.interceptors.request.use(
    (config) => {
      if (!config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (err) => Promise.reject(err)
  );

  client.interceptors.response.use(
    (res) => res,
    async (err) => {
      const prevRequest = err?.config;
      if (err?.response?.status === 401 && !prevRequest?.sent) {
        prevRequest.sent = true;
        const token = await refresh();
        if (token !== undefined && token.length > 0) {
          prevRequest.headers['Authorization'] = `Bearer ${token}`;
          return client(prevRequest);
        }
      }
      return Promise.reject(err);
    }
  );

  return client;
};
