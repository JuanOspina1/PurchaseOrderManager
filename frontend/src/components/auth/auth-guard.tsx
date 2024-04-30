'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import { isAxiosError } from 'axios';

import { ApiResponse } from '@/types/api-response';
import { User } from '@/types/user';
import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';
import { useAxios } from '@/hooks/useAxios';

export interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const client = useAxios();

  React.useEffect(() => {
    const checkUserSession = async () => {
      try {
        await client<ApiResponse<User>>('/user');
      } catch (err) {
        if (isAxiosError(err)) {
          router.replace(paths.auth.signIn);
        }
      }
    };

    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
  }, []);

  if (error) {
    return <Alert color="error">{error}</Alert>;
  }

  if (error) {
    return <Alert color="error">{error}</Alert>;
  }

  return <React.Fragment>{children}</React.Fragment>;
}
