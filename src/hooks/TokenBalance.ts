import { Address } from '@project-serum/anchor';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  getMinimumBalanceForRentExemptAccount,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import { LAMPORTS_PER_SOL, TokenAmount } from '@solana/web3.js';
import { isSol } from '@dcaf-labs/drip-sdk';
import { useAsyncMemo } from 'use-async-memo';
import { useDripContext } from '../contexts/DripContext';
import { useRefreshContext } from '../contexts/Refresh';
import { NetworkAddress } from '../models/NetworkAddress';
import { toPubkey } from '../utils/pubkey';

export function useTokenBalance(user?: Address, token?: NetworkAddress): TokenAmount | undefined {
  const drip = useDripContext();
  const refreshContext = useRefreshContext();

  return useAsyncMemo(async () => {
    if (!drip || !user || !token) return undefined;

    const tokenATA = await getAssociatedTokenAddress(
      toPubkey(token.address),
      toPubkey(user),
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    try {
      if (isSol(token.address)) {
        const depositForRentExemption = await getMinimumBalanceForRentExemptAccount(
          drip.provider.connection
        );

        const maxUseableSolBalance = Math.max(
          (await drip.provider.connection.getBalance(toPubkey(user))) -
            (depositForRentExemption + BUFFER_FOR_GAS),
          0
        );

        const uiAmount = maxUseableSolBalance / LAMPORTS_PER_SOL;

        return {
          decimals: 9,
          amount: maxUseableSolBalance.toString(),
          uiAmount: uiAmount,
          uiAmountString: uiAmount.toString()
        };
      }

      // Will throw an error if ATA doesn't exist on the wallet
      const tokenBalanceResponse = await drip.provider.connection.getTokenAccountBalance(
        tokenATA,
        drip.provider.connection.commitment
      );
      return tokenBalanceResponse.value;
    } catch (e) {
      console.log('error', e);
      return undefined;
    }
  }, [user, drip, token?.toPrimitiveDep(), refreshContext.refreshTrigger]);
}

const BUFFER_FOR_GAS = 0.01 * LAMPORTS_PER_SOL;
