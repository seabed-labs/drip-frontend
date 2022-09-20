import { Network } from '@dcaf-labs/drip-sdk/dist/models';
import { createContext, useContext } from 'react';
import { getNetwork } from '../utils/env';

const NetworkContext = createContext<Network>(getNetwork());

export function useNetwork() {
  return useContext(NetworkContext);
}
