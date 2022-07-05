// import React, { createContext, FC, ReactNode, useContext } from 'react';
// import useSWR from 'swr';

// export interface AuthContextProps {
//   user: any;
//   error: any;
// }

// const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
//   const { data, error, mutate } = useSWR(`/api/v1/auth/me`);

//   const googleLogIn = async (googleData: any) => {
//     const res = await fetch('/api/v1/auth/google', {
//       method: 'POST',
//       body: JSON.stringify({
//         token: googleData.tokenId
//       }),
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });
//     const data = await res.json();
//     if (data.error) throw new Error(data.error);
//     mutate();
//   };

//   const logOut = async () => {
//     await fetch('/api/v1/auth/logout', {
//       method: 'DELETE'
//     });
//     mutate();
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user: data,
//         error: error
//         // googleLogIn: googleLogIn,
//         // logOut: logOut
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import { createContext, useContext } from 'react';

export interface AuthContextProps {
  token: string;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function useAuthContext(): AuthContextProps | undefined {
  const authContext = useContext(AuthContext);
  return authContext;
}
