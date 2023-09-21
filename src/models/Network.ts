import { Network } from '@dcaf-labs/drip-sdk/dist/models';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

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
