import { toPubkey } from '@dcaf-labs/drip-sdk';
import { Address } from '@project-serum/anchor';
import { Account, TOKEN_PROGRAM_ID, unpackAccount } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { useMemo } from 'react';
import { useAsyncMemo } from 'use-async-memo';
import { useDripContext } from '../contexts/DripContext';
import { useRefreshContext } from '../contexts/Refresh';

export enum TokenAccountSortOpt {
  DescByBalance,
  AscByBalance,
  None
}

export interface TokenAccount {
  pubkey: PublicKey;
  account: Account;
}

export function useTokenAccounts(
  user: Address | undefined,
  opts: { sort: TokenAccountSortOpt } = { sort: TokenAccountSortOpt.None }
): TokenAccount[] | undefined {
  const drip = useDripContext();
  const refreshContext = useRefreshContext();
  const tokenAccounts = useAsyncMemo(async () => {
    if (!drip || !user) {
      return undefined;
    }

    return await drip.provider.connection.getTokenAccountsByOwner(toPubkey(user), {
      programId: TOKEN_PROGRAM_ID
    });
  }, [user?.toString(), drip, refreshContext.refreshTrigger]);

  return useMemo(() => {
    const accounts =
      tokenAccounts &&
      tokenAccounts.value.map((account) => {
        return {
          pubkey: account.pubkey,
          account: unpackAccount(account.pubkey, account.account, TOKEN_PROGRAM_ID)
        };
      });

    // TODO: We need to sort by price * amount, right now its just raw amount (not even with decimals)
    switch (opts.sort) {
      case TokenAccountSortOpt.AscByBalance:
        accounts?.sort((a, b) => {
          const amountA = a.account.amount;
          const amountB = b.account.amount;

          if (amountA < amountB) {
            return -1;
          } else {
            return 1;
          }
        });
        break;
      case TokenAccountSortOpt.DescByBalance:
        accounts?.sort((a, b) => {
          const amountA = a.account.amount;
          const amountB = b.account.amount;

          if (amountA <= amountB) {
            return 1;
          } else {
            return -1;
          }
        });
        break;
      case TokenAccountSortOpt.None:
        break;
    }

    return accounts;
  }, [tokenAccounts, opts.sort]);
}

export type TokenAccountMap = Partial<Record<string, Account>>;

export function useTokenAccountMap(user: Address | undefined): TokenAccountMap | undefined {
  const tokenAccounts = useTokenAccounts(user);
  return useMemo(
    () =>
      tokenAccounts?.reduce((map, tokenAccount) => {
        map[tokenAccount.pubkey.toBase58()] = tokenAccount.account;
        return map;
      }, {} as TokenAccountMap),
    [tokenAccounts]
  );
}
