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
  const { error, setDetails } = useUser();
  const [isLoading, setIsLoading] = React.useState(true)

  const client = useAxios();

  React.useEffect(() => {
    const checkUserSession = async () => {
      try {
        const res = await client<ApiResponse<User>>('/user');

        if (res.status === 200) {
          setDetails(res.data.data)
          router.replace(paths.dashboard.overview);
        }
      } catch (err) {
        setIsLoading(false)
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

  return <React.Fragment>{isLoading ? <p>Loading...</p> : children}</React.Fragment>;
}
