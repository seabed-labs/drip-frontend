import { TokenInfo } from '@solana/spl-token-registry';
import { useMemo } from 'react';
import { useTokenInfoContext } from '../contexts/TokenInfo';
import { NetworkAddress } from '../models/NetworkAddress';
import { useRemappedMint } from './MintRemap';

export function useTokenInfo(mint: NetworkAddress): TokenInfo | undefined {
  const tokenInfoMap = useTokenInfoContext();
  const infoMint = useRemappedMint(mint);

  return useMemo(
    () => tokenInfoMap?.[infoMint.network]?.[infoMint.address.toBase58()],
    [infoMint.toPrimitiveDep(), tokenInfoMap]
  );
}
