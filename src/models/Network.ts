import { Network } from '@dcaf-labs/drip-sdk/dist/models';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export function getClusterApiUrl(network: Network): string {
  switch (network) {
    case Network.Mainnet:
      return 'https://api.mainnet-beta.solana.com';
    // return 'https://dimensional-young-cloud.solana-mainnet.quiknode.pro/a5a0fb3cfa38ab740ed634239fd502a99dbf028d';
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
