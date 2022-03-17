import { Provider } from '@project-serum/anchor';
import { Wallet } from '@project-serum/anchor/src/provider';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { clusterApiUrl, Connection, PublicKey, Transaction } from '@solana/web3.js';
import { useMemo } from 'react';
import { Network } from '../models/network';
import { VaultClient } from '../vault-client';

// TODO: move this elsewhere
export class DefaultWallet implements Wallet {
  publicKey: PublicKey = PublicKey.default;

  signTransaction(): Promise<Transaction> {
    throw new Error('Default wallet cannot sign');
  }
  signAllTransactions(): Promise<Transaction[]> {
    throw new Error('Default wallet cannot sign');
  }

  static isDefaultWallet(wallet: Wallet) {
    return wallet.publicKey === PublicKey.default;
  }
}

const defaultWallet = new DefaultWallet();

export function useVaultClient(network?: Network) {
  const clusterUrl = clusterApiUrl(network === Network.Mainnet ? 'mainnet-beta' : 'devnet');
  const wallet = useAnchorWallet();
  return useMemo(
    () =>
      new VaultClient(
        new Provider(
          new Connection(clusterUrl, 'confirmed'),
          wallet || defaultWallet,
          Provider.defaultOptions()
        )
      ),
    [wallet]
  );
}
