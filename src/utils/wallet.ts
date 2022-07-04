import { Wallet } from '@project-serum/anchor';
import invariant from 'tiny-invariant';
import { DefaultWallet } from '../hooks/Drip';

export function assertWalletConnected(wallet: Wallet) {
  invariant(!DefaultWallet.isDefaultWallet(wallet), 'Wallet not connected');
}
