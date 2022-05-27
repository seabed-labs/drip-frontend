import { ZERO } from '@dcaf-labs/drip-sdk';
import { BN, Provider } from '@project-serum/anchor';
import { Wallet } from '@project-serum/anchor/src/provider';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { clusterApiUrl, Connection, PublicKey, Transaction } from '@solana/web3.js';
import { useMemo } from 'react';
import { useAsyncMemo } from 'use-async-memo';
import { Network } from '../models/Network';
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

export function useTokenABalance(tokenAMint?: string, network?: Network) {
  const clusterUrl = clusterApiUrl(network === Network.Mainnet ? 'mainnet-beta' : 'devnet');
  const wallet = useAnchorWallet();

  const vaultClient = new VaultClient(
    new Provider(
      new Connection(clusterUrl, 'confirmed'),
      wallet || defaultWallet,
      Provider.defaultOptions()
    )
  );
  return useAsyncMemo(
    async () =>
      tokenAMint
        ? new BN((await vaultClient.getUserTokenBalance(tokenAMint))?.toString() || '0')
        : ZERO,
    [wallet, tokenAMint]
  );
}
