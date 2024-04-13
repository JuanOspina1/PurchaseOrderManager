'use client';

import * as React from 'react';

import { User } from '@/types/user';
import { useState } from 'react';

export interface UserContextValue {
  accessToken : string,
  setAccessToken  : (data  : string) => void
  user: User;
  setDetails: (data : User) => void,
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
  const [accessToken, setAccessToken] = useState("")
  const [user, setDetails] = useState({} as User)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading]  = useState(true)

  return <UserContext.Provider value={{
    accessToken,
    setAccessToken,
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
