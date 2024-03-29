import { createContext, useContext } from 'react';
import { Drip } from '@dcaf-labs/drip-sdk';

export const DripContext = createContext<Drip | undefined>(undefined);

export function useDripContext(): Drip | undefined {
  const drip = useContext(DripContext);
  return drip;
}
