import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import { SignInWithPasswordParams } from '@/lib/auth/client';
import axios from '@/lib/axios';

import { useUser } from '../use-user';

export const useLogin = () => {
  const { checkSession } = useUser();
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: SignInWithPasswordParams) => {
      const res = await axios.post('http://localhost:5000/login', input);

      return res.data;
    },
    onSuccess: async () => {
      await checkSession?.();
      console.log('Login Successful!');
      router.refresh();
    },
  });
};
