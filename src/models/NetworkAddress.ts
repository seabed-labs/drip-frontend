import { Address } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { RenderDependency } from '../interfaces';
import { toPubkey } from '../utils/pubkey';
import { Network } from './Network';

export class NetworkAddress implements RenderDependency<string> {
  private constructor(public readonly network: Network, public readonly address: PublicKey) {}

  public static from(network: Network, address: Address): NetworkAddress {
    return new NetworkAddress(network, toPubkey(address));
  }

  public equals(other: NetworkAddress) {
    return this.network === other.network && this.address.toBase58() === other.address.toBase58();
  }

  toPrimitiveDep(): string {
    return `${this.network.toString()}:${this.address.toBase58()}`;
  }
}
