import { useMemo } from 'react';
import { Network } from '../models/Network';
import { NetworkAddress } from '../models/NetworkAddress';

const MINT_REMAP: Record<Network, Partial<Record<string, NetworkAddress>>> = {
  [Network.Mainnet]: {},
  [Network.Devnet]: {
    // wSOL
    BTZN3hrJ2S8s4A5iAEfUEEeaRnMUX8EsuG1nvTah2hmX: NetworkAddress.from(
      Network.Mainnet,
      'So11111111111111111111111111111111111111112'
    ),
    // USDC
    '5r23oKMycxnnjAJ4cEEkh1bbCowcZwzL6HYmhLqRazQa': NetworkAddress.from(
      Network.Mainnet,
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
    ),
    // ETH
    DweqWEsB5UviF93NnvWDP4H2NabMUzST2WP3CB7FfpXZ: NetworkAddress.from(
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
