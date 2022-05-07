import { useMemo } from 'react';
import { Network } from '../models/Network';
import { NetworkAddress } from '../models/NetworkAddress';

const MINT_REMAP: Record<Network, Partial<Record<string, NetworkAddress>>> = {
  [Network.Mainnet]: {},
  [Network.Devnet]: {
    BfqATYbPZJFdEdYWkEbFRBnhv1LB6wtLn299HjMmE4uq: NetworkAddress.from(
      Network.Mainnet,
      'So11111111111111111111111111111111111111112'
    )
  }
};

export function useRemappedMint(mint: NetworkAddress): NetworkAddress {
  return useMemo(
    () => MINT_REMAP[mint.network][mint.address.toBase58()] ?? mint,
    [mint.toPrimitiveDep()]
  );
}
