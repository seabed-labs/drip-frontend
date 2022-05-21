import { createContext, useContext } from 'react';
import { TokenInfoMap } from '../hooks/TokenInfoMap';

export const TokenInfoContext = createContext<TokenInfoMap | undefined>(undefined);

export function useTokenInfoContext() {
  return useContext(TokenInfoContext);
}
