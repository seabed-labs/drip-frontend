import { Network } from '@dcaf-labs/drip-sdk/dist/models';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export function getClusterApiUrl(network: Network): string {
  switch (network) {
    case Network.Mainnet:
      return 'https://cool-solemn-liquid.solana-mainnet.discover.quiknode.pro/a53553135e6ca4ccd29c986c76c9a2eae849f60e/';
    // return 'https://api.mainnet-beta.solana.com';
    case Network.Devnet:
      return 'https://api.devnet.solana.com';
    // return 'https://fabled-bitter-tent.solana-devnet.quiknode.pro/ea2807069cec3658c0e16618bea5a5c9b85e0dd7';
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
