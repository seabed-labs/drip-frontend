import { Address } from '@project-serum/anchor';
import { useMemo } from 'react';
import { useNetwork } from '../contexts/NetworkContext';
import { NetworkAddress } from '../models/NetworkAddress';

export function useNetworkAddress(address?: Address): NetworkAddress | undefined {
  const addressStr = address?.toString();
  const network = useNetwork();

  return useMemo(
    () => (addressStr ? NetworkAddress.from(network, addressStr) : undefined),
    [addressStr, network]
  );
}
