import { Token } from '@dcaf-labs/drip-sdk';
import { Address } from '@project-serum/anchor';
import { useAsyncMemo } from 'use-async-memo';
import { useDripContext } from '../contexts/DripContext';
import { toPubkey } from '../utils/pubkey';

export function useTokenAs(forTokenB?: Address): Token[] | undefined {
  const drip = useDripContext();

  return useAsyncMemo(async () => {
    if (!drip) return undefined;

    const tokenAsRecord = await drip.config.getAllTokenAs(
      forTokenB ? toPubkey(forTokenB) : undefined
    );

    return Object.values(tokenAsRecord);
  }, [drip, forTokenB]);
}

export function useTokenBs(forTokenA?: Address): Token[] | undefined {
  const drip = useDripContext();

  return useAsyncMemo(async () => {
    if (!drip) return undefined;

    const tokenBsRecord = await drip.config.getAllTokenBs(
      forTokenA ? toPubkey(forTokenA) : undefined
    );

    return Object.values(tokenBsRecord);
  }, [drip, forTokenA]);
}
