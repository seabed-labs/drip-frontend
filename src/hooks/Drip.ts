import { Drip } from '@dcaf-labs/drip-sdk';
import { AnchorProvider } from '@project-serum/anchor';
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { useMemo } from 'react';
import { useNetwork } from '../contexts/NetworkContext';
import { getClusterApiUrl } from '../models/Network';
import { getProgramId } from '../utils/env';

export class DefaultWallet {
  publicKey: PublicKey = PublicKey.default;

  signTransaction(): Promise<Transaction> {
    throw new Error('Default wallet cannot sign');
  }
  signAllTransactions(): Promise<Transaction[]> {
    throw new Error('Default wallet cannot sign');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isDefaultWallet(wallet: any) {
    return wallet.publicKey === PublicKey.default;
  }
}

const defaultWallet = new DefaultWallet();

export function useDrip(): Drip {
  const network = useNetwork();
  const wallet = useWallet();
  const anchorWallet = useAnchorWallet();
  return useMemo(() => {
    const clusterUrl = getClusterApiUrl(network);
    const drip = new Drip(
      network,
      new AnchorProvider(
        new Connection(clusterUrl, 'confirmed'),
        anchorWallet ?? defaultWallet,
        AnchorProvider.defaultOptions()
      ),
      getProgramId()
    );

    return drip;
  }, [wallet, anchorWallet]);
}
