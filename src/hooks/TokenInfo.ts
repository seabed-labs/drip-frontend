import { TokenInfo } from '@solana/spl-token-registry';
import { useMemo } from 'react';
import { NetworkAddress } from '../models/NetworkAddress';
import { useTokenInfoMap } from './TokenInfoMap';

export function useTokenInfo(address: NetworkAddress): TokenInfo | undefined {
  const tokenInfoMap = useTokenInfoMap();

  return useMemo(
    () => tokenInfoMap?.[address.network]?.[address.address.toBase58()],
    [address.toPrimitiveDep(), tokenInfoMap]
  );
}
