import { createContext, useContext } from 'react';

export interface AuthContextProps {
  token: string;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function useAuthContext(): AuthContextProps | undefined {
  const authContext = useContext(AuthContext);
  return authContext;
}
