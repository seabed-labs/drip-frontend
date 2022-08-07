import { useMemo } from 'react';
import { Network } from '../models/Network';
import { NetworkAddress } from '../models/NetworkAddress';

const MINT_REMAP: Record<Network, Partial<Record<string, NetworkAddress>>> = {
  [Network.Mainnet]: {},
  [Network.Devnet]: {
    // // wSOL
    // '8LXJFDvW9nrp4MXb4rSW7eSvxAhdzmdiUpNHiDdzJaNP': NetworkAddress.from(
    //   Network.Mainnet,
    //   'So11111111111111111111111111111111111111112'
    // ),
    // USDC
    '8ULDKGmKJJaZa32eiL36ARr6cFaZaoAXAosWeg5r17ra': NetworkAddress.from(
      Network.Mainnet,
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
    ),
    // // ETH
    // DqakM9iwYs425rToh9LCXzfzc1Xh3A3nrz36QkSJTfNd: NetworkAddress.from(
    //   Network.Mainnet,
    //   '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs'
    // ),
    // BTC
    '5nY3xT4PJe7NU41zqBx5UACHDckrimmfwznv4uLenrQg': NetworkAddress.from(
      Network.Mainnet,
      '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E'
    )
  }
};

export function useRemappedMint(mint?: NetworkAddress): NetworkAddress | undefined {
  return useMemo(
    () => (mint && MINT_REMAP[mint.network][mint.address.toBase58()]) ?? mint,
    [mint && mint.toPrimitiveDep()]
  );
}
