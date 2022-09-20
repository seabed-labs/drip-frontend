import { ClientEnv, Network } from '@dcaf-labs/drip-sdk';

export function getNetwork(): Network {
  const react_app_network = process.env.REACT_APP_NETWORK;
  if (!react_app_network || react_app_network === 'local') {
    return Network.Localnet;
  } else if (react_app_network === 'devnet') {
    return Network.Devnet;
  }
  return Network.Mainnet;
}

export function getClientEnv(): ClientEnv {
  const reactAppClientEnv = process.env.REACT_APP_CLIENT_ENV;
  if (!reactAppClientEnv || reactAppClientEnv === 'staging') {
    return ClientEnv.Staging;
  }
  return ClientEnv.Production;
}

export function getProgramId(): string {
  return process.env.REACT_APP_DRIP_PROGRAM_ID ?? 'F1NyoZsUhJzcpGyoEqpDNbUMKVvCnSXcCki1nN3ycAeo';
}
