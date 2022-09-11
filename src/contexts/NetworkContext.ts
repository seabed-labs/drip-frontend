import { Network } from '@dcaf-labs/drip-sdk/dist/models';
import { createContext, useContext } from 'react';

function getNetwork(): Network {
  const react_app_network = process.env.REACT_APP_NETWORK;

  if (!react_app_network || react_app_network === 'devnetprod') {
    return Network.DevnetProd;
  } else if (react_app_network === 'devnetstaging') {
    return Network.DevnetStaging;
  }
  // For prod we only have 1 program (the main program)
  // So mainnetstaging and mainnetprod will be the same app experience (same program, same backend)
  return Network.MainnetProd;
}

const NetworkContext = createContext<Network>(getNetwork());

export function useNetwork() {
  return useContext(NetworkContext);
}
