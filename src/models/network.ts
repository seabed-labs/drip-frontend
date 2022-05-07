import { ENV } from '@solana/spl-token-registry';

export enum Network {
  Mainnet,
  Devnet
}

export function toENV(network: Network): ENV {
  switch (network) {
    case Network.Mainnet:
      return ENV.MainnetBeta;
    case Network.Devnet:
      return ENV.Devnet;
  }
}

export function fromENV(env: ENV): Network {
  switch (env) {
    case ENV.MainnetBeta:
      return Network.Mainnet;
    case ENV.Devnet:
      return Network.Devnet;
    case ENV.Testnet:
      throw new Error('Testnet not supported');
  }
}
