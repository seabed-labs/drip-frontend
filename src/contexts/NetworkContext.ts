import { createContext, useContext } from 'react';
import { Network } from '../models/Network';

const NetworkContext = createContext<Network>(
  process.env.REACT_APP_NETWORK === 'MAINNETBETA' ? Network.Mainnet : Network.Devnet
);

export function useNetwork() {
  return useContext(NetworkContext);
}
