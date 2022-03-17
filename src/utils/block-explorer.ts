import { TransactionSignature } from '@solana/web3.js';
import { Network } from '../models/network';

export function solscanTxUrl(txSignature: TransactionSignature, network: Network) {
  switch (network) {
    case Network.Mainnet:
      return `https://solscan.io/tx/${txSignature}`;
    case Network.Devnet:
      return `https://solscan.io/tx/${txSignature}?cluster=devnet`;
  }
}
