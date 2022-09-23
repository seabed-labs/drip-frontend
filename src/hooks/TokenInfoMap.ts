import { Network } from '@dcaf-labs/drip-sdk/dist/models';
import { ENV, TokenInfo, TokenListProvider } from '@solana/spl-token-registry';
import { useEffect, useState } from 'react';
import { isSupportedENV } from '../models/Network';

export function useTokenInfoMap(): TokenInfoMap | undefined {
  const [tokenInfoMap, setTokenInfoMap] = useState<TokenInfoMap>();

  useEffect(() => {
    (async () => {
      const tokens = await new TokenListProvider().resolve();
      setTokenInfoMap(
        tokens
          .getList()
          .filter((tokenInfo) => isSupportedENV(tokenInfo.chainId))
          .reduce(
            (map, tokenInfo) => {
              if (tokenInfo?.chainId === ENV.MainnetBeta) {
                map[Network.Mainnet][tokenInfo.address] = tokenInfo;
              } else if (tokenInfo?.chainId === ENV.Devnet) {
                map[Network.Devnet][tokenInfo.address] = tokenInfo;
              }
              return map;
            },
            {
              [Network.Mainnet]: {},
              [Network.Devnet]: {}
            } as TokenInfoMap
          )
      );
    })();
  }, [setTokenInfoMap]);

  return tokenInfoMap;
}

export type TokenInfoMap = Record<Network, Partial<Record<string, TokenInfo>>>;
