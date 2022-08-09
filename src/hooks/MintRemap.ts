import { useMemo } from 'react';
import { Network } from '../models/Network';
import { NetworkAddress } from '../models/NetworkAddress';

const MINT_REMAP: Record<Network, Partial<Record<string, NetworkAddress>>> = {
  [Network.Mainnet]: {},
  [Network.Devnet]: {
    // USDC (Orca USDC)
    EmXq3Ni9gfudTiyNKzzYvpnQqnJEMRw2ttnVXoJXjLo1: NetworkAddress.from(
      Network.Mainnet,
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
    ),
    // USDT
    '8ULDKGmKJJaZa32eiL36ARr6cFaZaoAXAosWeg5r17ra': NetworkAddress.from(
      Network.Mainnet,
      'BQcdHdAQW1hczDbBi9hiegXAR7A98Q9jx3X3iBBBDiq4'
    ),
    // BTC
    '5nY3xT4PJe7NU41zqBx5UACHDckrimmfwznv4uLenrQg': NetworkAddress.from(
      Network.Mainnet,
      '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E'
    )
    // // ETH
    // DqakM9iwYs425rToh9LCXzfzc1Xh3A3nrz36QkSJTfNd: NetworkAddress.from(
    //   Network.Mainnet,
    //   '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs'
    // ),
  }
};

export function useRemappedMint(mint?: NetworkAddress): NetworkAddress | undefined {
  return useMemo(
    () => (mint && MINT_REMAP[mint.network][mint.address.toBase58()]) ?? mint,
    [mint && mint.toPrimitiveDep()]
  );
}
