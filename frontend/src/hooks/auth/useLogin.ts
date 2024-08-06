import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import { AuthResponse } from '@/types/auth/AuthResponse';
import { SignInWithPasswordParams } from '@/lib/auth/client';
import axios from '@/lib/axios';

import { useUser } from '../use-user';

export const useLogin = () => {
  const { setAccessToken, setDetails } = useUser();
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: SignInWithPasswordParams) => {
      const res = await axios.post<AuthResponse>('/login', input, { withCredentials: true });

      return res.data;
    },
    onSuccess: async ({ accessToken, data }) => {
      // await checkSession?.();
      setAccessToken(accessToken);
      setDetails(data);
      router.push('/dashboard');
    },
  });
};
