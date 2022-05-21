import { TransactionSignature } from '@solana/web3.js';
import { Network } from '../models/Network';
import { NetworkAddress } from '../models/NetworkAddress';

export function solscanTxUrl(txSignature: TransactionSignature, network: Network) {
  switch (network) {
    case Network.Mainnet:
      return `https://solscan.io/tx/${txSignature}`;
    case Network.Devnet:
      return `https://solscan.io/tx/${txSignature}?cluster=devnet`;
  }
}

export function solscanTokenUrl(tokenMint: NetworkAddress): string {
  switch (tokenMint.network) {
    case Network.Mainnet:
      return `https://solscan.io/token/${tokenMint.address.toBase58()}`;
    case Network.Devnet:
      return `https://solscan.io/token/${tokenMint.address.toBase58()}?cluster=devnet`;
  }
}
