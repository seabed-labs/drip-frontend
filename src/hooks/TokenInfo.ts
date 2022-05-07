import { TokenInfo } from '@solana/spl-token-registry';
import { useMemo } from 'react';
import { NetworkAddress } from '../models/NetworkAddress';
import { useRemappedMint } from './MintRemap';
import { useTokenInfoMap } from './TokenInfoMap';

export function useTokenInfo(mint: NetworkAddress): TokenInfo | undefined {
  const tokenInfoMap = useTokenInfoMap();
  const infoMint = useRemappedMint(mint);

  return useMemo(
    () => tokenInfoMap?.[infoMint.network]?.[infoMint.address.toBase58()],
    [infoMint.toPrimitiveDep(), tokenInfoMap]
  );
}
