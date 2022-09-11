import { Network } from '@dcaf-labs/drip-sdk/dist/models';
import { useMemo } from 'react';
import { NetworkAddress } from '../models/NetworkAddress';

const MINT_REMAP: Record<Network, Partial<Record<string, NetworkAddress>>> = {
  [Network.MainnetProd]: {},
  [Network.DevnetProd]: {
    // USDC (Orca USDC)
    EmXq3Ni9gfudTiyNKzzYvpnQqnJEMRw2ttnVXoJXjLo1: NetworkAddress.from(
      Network.MainnetProd,
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
    ),
    // USDT
    H9gBUJs5Kc5zyiKRTzZcYom4Hpj9VPHLy4VzExTVPgxa: NetworkAddress.from(
      Network.MainnetProd,
      'BQcdHdAQW1hczDbBi9hiegXAR7A98Q9jx3X3iBBBDiq4'
    ),
    // BTC
    '7ihthG4cFydyDnuA3zmJrX13ePGpLcANf3tHLmKLPN7M': NetworkAddress.from(
      Network.MainnetProd,
      '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E'
    )
  },
  [Network.DevnetStaging]: {
    // USDC (Orca USDC)
    EmXq3Ni9gfudTiyNKzzYvpnQqnJEMRw2ttnVXoJXjLo1: NetworkAddress.from(
      Network.MainnetProd,
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
    ),
    // USDT
    H9gBUJs5Kc5zyiKRTzZcYom4Hpj9VPHLy4VzExTVPgxa: NetworkAddress.from(
      Network.MainnetProd,
      'BQcdHdAQW1hczDbBi9hiegXAR7A98Q9jx3X3iBBBDiq4'
    ),
    // BTC
    '7ihthG4cFydyDnuA3zmJrX13ePGpLcANf3tHLmKLPN7M': NetworkAddress.from(
      Network.MainnetProd,
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
