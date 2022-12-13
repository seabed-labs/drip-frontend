import { ClientEnv, Network } from '@dcaf-labs/drip-sdk';
import { Configuration, DefaultApi } from '@dcaf-labs/drip-ts';
import { getClientEnv, getNetwork } from '../../utils/env';

export function getApiUrl(network: Network, clientEnv: ClientEnv): string {
  switch (network) {
    case Network.Mainnet:
      return 'https://api.drip.dcaf.so';
    case Network.Devnet:
      switch (clientEnv) {
        case ClientEnv.Production:
          return 'https://devnet.api.drip.dcaf.so';
        case ClientEnv.Staging:
          return 'http://localhost:8080';
      }
  }
  return 'localhost';
}

export function getDripApi(): DefaultApi {
  const network = getNetwork();
  const client = getClientEnv();
  const url = getApiUrl(network, client);

  const config = new Configuration({
    basePath: url
  });
  return new DefaultApi(config);
}
