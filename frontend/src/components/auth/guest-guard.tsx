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

export interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { user, error, isLoading, setIsLoading } = useUser();
  const client = useAxios();

  React.useEffect(() => {
    const checkUserSession = async () => {
      try {
        const res = await client<ApiResponse<User>>('http://localhost:5000/user');

        if (res.status === 200) {
          router.replace(paths.dashboard.overview);
        }
      } catch (err) {
        if (isAxiosError(err)) {
          logger.debug(err.message);
        }
      }
    };
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
  }, []);

  if (error) {
    return <Alert color="error">{error}</Alert>;
  }

  return <React.Fragment>{children}</React.Fragment>;
}
