import { createContext, useContext } from 'react';
import { TokenMap } from '../hooks/TokenInfoMap';

export const TokenMapContext = createContext<TokenMap | undefined>(undefined);

export function useTokenMapContext() {
  return useContext(TokenMapContext);
}
