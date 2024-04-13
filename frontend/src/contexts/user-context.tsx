'use client';

import * as React from 'react';

import { UserWithAccessToken } from '@/types/user';
import { useState } from 'react';

export interface UserContextValue {
  user: UserWithAccessToken;
  setDetails: (data : UserWithAccessToken) => void,
  error: string,
  setError: (data : string) => void,
  isLoading: boolean;
  setIsLoading : (data : boolean) => void, 
}

export const UserContext = React.createContext<UserContextValue | undefined>(undefined);

export interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps): React.JSX.Element {
  const [user, setDetails] = useState({} as UserWithAccessToken)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading]  = useState(true)

  return <UserContext.Provider value={{
    user,
    setDetails,
    error,
    setError,
    isLoading,
    setIsLoading
  }}>
    {children}
  </UserContext.Provider>;
}

export const UserConsumer = UserContext.Consumer;
