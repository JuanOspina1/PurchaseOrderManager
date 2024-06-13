import axios from 'axios';

export const setupAxiosForServer = async (
  accessToken: string,
  refresh: () => Promise<string | undefined>,
  setIsLoading: (isLoading: boolean) => void
) => {
  const client = axios.create();

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
        if (token) {
          prevRequest.headers['Authorization'] = `Bearer ${token}`;
          setIsLoading(false);
          return client(prevRequest);
        }
      }
      setIsLoading(false);
      return Promise.reject(err);
    }
  );

  return client;
};
