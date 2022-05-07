import { createContext, useContext } from 'react';
import { Network } from '../models/Network';

// TODO: Make this an env variable
const NetworkContext = createContext<Network>(Network.Devnet);

export function useNetwork() {
  return useContext(NetworkContext);
}
