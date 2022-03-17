import { PublicKey, TransactionSignature } from '@solana/web3.js';
import {
  SECONDS_IN_A_DAY,
  SECONDS_IN_A_HOUR,
  SECONDS_IN_A_MONTH,
  SECONDS_IN_A_WEEK
} from '../utils/time';

export enum DcaGranularity {
  Hourly = SECONDS_IN_A_HOUR,
  Daily = SECONDS_IN_A_DAY,
  Weekly = SECONDS_IN_A_WEEK,
  Monthly = SECONDS_IN_A_MONTH
}

export interface TxResult {
  txHash: TransactionSignature;
}

export interface InitTxResult extends TxResult {
  publicKey: PublicKey;
}
