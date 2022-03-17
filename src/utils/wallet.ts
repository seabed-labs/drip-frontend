import { Wallet } from '@project-serum/anchor/src/provider';
import invariant from 'tiny-invariant';
import { DefaultWallet } from '../hooks/VaultClient';

export function assertWalletConnected(wallet: Wallet) {
  invariant(!DefaultWallet.isDefaultWallet(wallet), 'Wallet not connected');
}
