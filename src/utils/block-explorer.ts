import { Network } from '@dcaf-labs/drip-sdk/dist/models';
import { TransactionSignature } from '@solana/web3.js';
import { NetworkAddress } from '../models/NetworkAddress';

export function solscanTxUrl(txSignature: TransactionSignature, network: Network) {
  switch (network) {
    case Network.MainnetProd:
      return `https://solscan.io/tx/${txSignature}`;
    case Network.DevnetProd:
    case Network.DevnetStaging:
      return `https://solscan.io/tx/${txSignature}?cluster=devnet`;
  }
}

export function solscanTokenUrl(tokenMint: NetworkAddress): string {
  switch (tokenMint.network) {
    case Network.MainnetProd:
      return `https://solscan.io/token/${tokenMint.address.toBase58()}`;
    case Network.DevnetProd:
    case Network.DevnetStaging:
      return `https://solscan.io/token/${tokenMint.address.toBase58()}?cluster=devnet`;
  }
}
