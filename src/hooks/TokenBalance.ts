import { Address } from '@project-serum/anchor';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import { TokenAmount } from '@solana/web3.js';
import { useAsyncMemo } from 'use-async-memo';
import { useDripContext } from '../contexts/DripContext';
import { NetworkAddress } from '../models/NetworkAddress';
import { toPubkey } from '../utils/pubkey';

export function useTokenBalance(user: Address, token: NetworkAddress): TokenAmount | undefined {
  const drip = useDripContext();

  return useAsyncMemo(async () => {
    if (!drip) return undefined;

    const tokenATA = await getAssociatedTokenAddress(
      toPubkey(token.address),
      toPubkey(user),
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const tokenBalanceResponse = await drip.provider.connection.getTokenAccountBalance(
      tokenATA,
      drip.provider.connection.commitment
    );

    return tokenBalanceResponse.value;
  }, [user, drip, token.toPrimitiveDep()]);
}
