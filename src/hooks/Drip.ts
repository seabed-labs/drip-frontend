import { Drip } from '@dcaf/drip-sdk';
import { Network } from '@dcaf/drip-sdk/dist/models';
import { Provider } from '@project-serum/anchor';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import { useMemo } from 'react';
import { useNetwork } from '../contexts/NetworkContext';
import { DefaultWallet } from './VaultClient';

const defaultWallet = new DefaultWallet();

export function useDrip(): Drip {
  const network = useNetwork();
  const wallet = useAnchorWallet();
  return useMemo(() => {
    const clusterUrl = clusterApiUrl(network === Network.Mainnet ? 'mainnet-beta' : 'devnet');
    const drip = new Drip(
      network,
      new Provider(
        new Connection(clusterUrl, 'confirmed'),
        wallet || defaultWallet,
        Provider.defaultOptions()
      )
    );

    return drip;
  }, [wallet]);
}
