import { Address } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

export function isPubkey(maybePubkey: unknown): maybePubkey is PublicKey {
  return maybePubkey instanceof PublicKey;
}

export function toPubkey(addr: Address): PublicKey {
  if (isPubkey(addr)) {
    return addr;
  }

  return new PublicKey(addr);
}

export function displayPubkey(addr: Address): string {
  return `${addr.toString().slice(0, 4)}...${addr.toString().slice(-4)}`;
}
