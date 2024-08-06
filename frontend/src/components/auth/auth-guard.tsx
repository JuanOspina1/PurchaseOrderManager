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
  const { error, setDetails} = useUser();
  const client = useAxios();
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const checkUserSession = async () => {
      try {
        const res = await client<ApiResponse<User>>('/user');
        setDetails(res.data.data)
        setIsLoading(false)
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

  return <>{isLoading ? <p>Loading...</p> :children}</>;
}
