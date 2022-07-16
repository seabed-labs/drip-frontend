import { getMint } from '@solana/spl-token';
import { TokenInfo } from '@solana/spl-token-registry';
import { useMemo } from 'react';
import { useAsyncMemo } from 'use-async-memo';
import { useDripContext } from '../contexts/DripContext';
import { useTokenInfoContext } from '../contexts/TokenInfo';
import { NetworkAddress } from '../models/NetworkAddress';
import { useRemappedMint } from './MintRemap';

export function useTokenInfo(mint?: NetworkAddress): TokenInfo | undefined {
  const tokenInfoMap = useTokenInfoContext();
  const infoMint = useRemappedMint(mint);
  const drip = useDripContext();
  const actualMint = useAsyncMemo(
    async () => drip && mint && getMint(drip?.provider.connection, mint.address),
    [mint?.toPrimitiveDep(), drip]
  );

  return useMemo(() => {
    const tokenInfo = infoMint && tokenInfoMap?.[infoMint.network]?.[infoMint.address.toBase58()];
    if (!tokenInfo || !actualMint) {
      return undefined;
    }

    return {
      ...tokenInfo,
      decimals: actualMint.decimals
    };
  }, [infoMint && infoMint.toPrimitiveDep(), tokenInfoMap, actualMint]);
}
