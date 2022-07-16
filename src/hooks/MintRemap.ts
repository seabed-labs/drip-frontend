import { useMemo } from 'react';
import { Network } from '../models/Network';
import { NetworkAddress } from '../models/NetworkAddress';

const MINT_REMAP: Record<Network, Partial<Record<string, NetworkAddress>>> = {
  [Network.Mainnet]: {},
  [Network.Devnet]: {
    // wSOL
    GAstZSga54WrsQdDZ9pgch6Xe9Lyxaiyx4sY23nKyEZ4: NetworkAddress.from(
      Network.Mainnet,
      'So11111111111111111111111111111111111111112'
    ),
    // USDC
    E3R1FopVaFpPAXojjdhJvWfKyaPuGHrx2GY7RCvHn7Dy: NetworkAddress.from(
      Network.Mainnet,
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
    )
  }
};

export function useRemappedMint(mint?: NetworkAddress): NetworkAddress | undefined {
  return useMemo(
    () => (mint && MINT_REMAP[mint.network][mint.address.toBase58()]) ?? mint,
    [mint && mint.toPrimitiveDep()]
  );
}
