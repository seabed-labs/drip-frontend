import { useMemo } from 'react';
import { Network } from '../models/Network';
import { NetworkAddress } from '../models/NetworkAddress';

const MINT_REMAP: Record<Network, Partial<Record<string, NetworkAddress>>> = {
  [Network.Mainnet]: {},
  [Network.Devnet]: {
    // wSOL
    BfqATYbPZJFdEdYWkEbFRBnhv1LB6wtLn299HjMmE4uq: NetworkAddress.from(
      Network.Mainnet,
      'So11111111111111111111111111111111111111112'
    ),
    // USDC
    ASuqwxvC4FXxJGT9XqZMXbCKDQBaRTApEhN2oN3VL3A8: NetworkAddress.from(
      Network.Mainnet,
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
    ),
    // ETH
    '54uPbRrVwYsvZZMmsCXjLCtshgTquBWDZTNTJNbEDZ4H': NetworkAddress.from(
      Network.Mainnet,
      '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs'
    )
  }
};

export function useRemappedMint(mint?: NetworkAddress): NetworkAddress | undefined {
  return useMemo(
    () => (mint && MINT_REMAP[mint.network][mint.address.toBase58()]) ?? mint,
    [mint && mint.toPrimitiveDep()]
  );
}
