import { ENV } from '@solana/spl-token-registry';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export enum Network {
  Mainnet,
  Devnet
}

export function toENV(network: Network): ENV {
  switch (network) {
    case Network.Mainnet:
      return ENV.MainnetBeta;
    case Network.Devnet:
      return ENV.Devnet;
  }
}

export function fromENV(env: ENV): Network {
  switch (env) {
    case ENV.MainnetBeta:
      return Network.Mainnet;
    case ENV.Devnet:
      return Network.Devnet;
    case ENV.Testnet:
      throw new Error('Testnet not supported');
  }
}

export function isSupportedENV(env: ENV): boolean {
  switch (env) {
    case ENV.MainnetBeta:
    case ENV.Devnet:
      return true;
    default:
      return false;
  }
}

export function getClusterApiUrl(network: Network): string {
  switch (network) {
    case Network.Mainnet:
      return 'https://ssc-dao.genesysgo.net';
    case Network.Devnet:
      return 'https://devnet.genesysgo.net';
  }
}

export function toWalletAdapterNetwork(network: Network): WalletAdapterNetwork {
  switch (network) {
    case Network.Mainnet:
      return WalletAdapterNetwork.Mainnet;
    case Network.Devnet:
      return WalletAdapterNetwork.Devnet;
  }
}
