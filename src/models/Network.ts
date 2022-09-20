import { Network } from '@dcaf-labs/drip-sdk/dist/models';
import { ENV } from '@solana/spl-token-registry';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export function toENV(network: Network): ENV {
  switch (network) {
    case Network.Mainnet:
      return ENV.MainnetBeta;
    case Network.Devnet:
      return ENV.Devnet;
    default:
      return ENV.Devnet;
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
      return 'https://api.mainnet-beta.solana.com';
    case Network.Devnet:
      return 'https://api.devnet.solana.com';
    default:
      return 'http://127.0.0.1:8899';
  }
}

export function toWalletAdapterNetwork(network: Network): WalletAdapterNetwork {
  switch (network) {
    case Network.Mainnet:
      return WalletAdapterNetwork.Mainnet;
    case Network.Devnet:
      return WalletAdapterNetwork.Devnet;
    default:
      return WalletAdapterNetwork.Devnet;
  }
}
