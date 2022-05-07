import { Address } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { useAsyncMemo } from 'use-async-memo';
import { useDripContext } from '../contexts/DripContext';
import { toPubkey } from '../utils/pubkey';

export function useTokenAs(forTokenB?: Address): PublicKey[] | undefined {
  const drip = useDripContext();

  return useAsyncMemo(async () => {
    if (!drip) return undefined;

    const tokenAsRecord = await drip.querier.getAllTokenAs(
      forTokenB ? toPubkey(forTokenB) : undefined
    );

    return Object.values(tokenAsRecord).map((tokenA) => tokenA.mint);
  }, [drip, forTokenB]);
}

export function useTokenBs(forTokenA?: Address): PublicKey[] | undefined {
  const drip = useDripContext();

  return useAsyncMemo(async () => {
    if (!drip) return undefined;

    const tokenBsRecord = await drip.querier.getAllTokenBs(
      forTokenA ? toPubkey(forTokenA) : undefined
    );

    return Object.values(tokenBsRecord).map((tokenB) => tokenB.mint);
  }, [drip, forTokenA]);
}
