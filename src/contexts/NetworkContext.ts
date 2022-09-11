import { Network } from '@dcaf-labs/drip-sdk/dist/models';
import { createContext, useContext } from 'react';

function getNetwork(): Network {
  const react_app_network = process.env.REACT_APP_NETWORK;

  if (!react_app_network || react_app_network === 'devnetprod') {
    console.log('devnetprod');
    return Network.DevnetProd;
  } else if (react_app_network === 'devnetstaging') {
    console.log('devnetstaging');
    return Network.DevnetStaging;
  }
  return Network.MainnetProd;
}

const NetworkContext = createContext<Network>(getNetwork());

export function useNetwork() {
  return useContext(NetworkContext);
}
