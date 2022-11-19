import { Address } from '@project-serum/anchor';
import { useMemo } from 'react';
import { useTokenAccountMap } from './TokenAccounts';

export type TokenBalanceMap = Partial<Record<string, bigint>>;

export function useTokenBalances(user?: Address): TokenBalanceMap | undefined {
  const tokenAccountMap = useTokenAccountMap(user);
  return useMemo(() => {
    if (!user || !tokenAccountMap) return undefined;

    return Object.values(tokenAccountMap).reduce((map, tokenAccount) => {
      if (tokenAccount) {
        map[tokenAccount.mint.toBase58()] = tokenAccount.amount;
      }

      return map;
    }, {} as TokenBalanceMap);
  }, [user?.toString(), tokenAccountMap]);
}
