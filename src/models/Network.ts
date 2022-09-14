import { Network } from '@dcaf-labs/drip-sdk/dist/models';
import { ENV } from '@solana/spl-token-registry';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export function toENV(network: Network): ENV {
  switch (network) {
    case Network.MainnetProd:
      return ENV.MainnetBeta;
    case Network.DevnetProd:
    case Network.DevnetStaging:
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
    case Network.MainnetProd:
      return 'https://api.mainnet-beta.solana.com';
    case Network.DevnetProd:
    case Network.DevnetStaging:
      return 'https://api.devnet.solana.com';
  }
}

export function toWalletAdapterNetwork(network: Network): WalletAdapterNetwork {
  switch (network) {
    case Network.MainnetProd:
      return WalletAdapterNetwork.Mainnet;
    case Network.DevnetProd:
    case Network.DevnetStaging:
      return WalletAdapterNetwork.Devnet;
  }
}
