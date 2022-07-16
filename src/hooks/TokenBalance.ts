import { Address } from '@project-serum/anchor';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import { TokenAmount } from '@solana/web3.js';
import { useEffect } from 'react';
import { useAsyncMemo } from 'use-async-memo';
import { useDripContext } from '../contexts/DripContext';
import { useRefreshContext } from '../contexts/Refresh';
import { NetworkAddress } from '../models/NetworkAddress';
import { toPubkey } from '../utils/pubkey';

export function useTokenBalance(user?: Address, token?: NetworkAddress): TokenAmount | undefined {
  const drip = useDripContext();
  const refreshContext = useRefreshContext();

  useEffect(() => {
    console.log('token balance updated refresh', refreshContext.refreshTrigger);
  }, [refreshContext.refreshTrigger]);

  return useAsyncMemo(async () => {
    console.log('fetching');

    if (!drip || !user || !token) return undefined;

    const tokenATA = await getAssociatedTokenAddress(
      toPubkey(token.address),
      toPubkey(user),
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    try {
      // Will throw an error if ATA doesn't exist on the wallet
      const tokenBalanceResponse = await drip.provider.connection.getTokenAccountBalance(
        tokenATA,
        drip.provider.connection.commitment
      );
      return tokenBalanceResponse.value;
    } catch (e) {
      return undefined;
    }
  }, [user, drip, token?.toPrimitiveDep(), refreshContext.refreshTrigger]);
}
