import { TokenInfo, TokenListProvider } from '@solana/spl-token-registry';
import { useEffect, useState } from 'react';
import { fromENV, isSupportedENV, Network } from '../models/Network';

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
              const network = fromENV(tokenInfo.chainId);
              map[network][tokenInfo.address] = tokenInfo;

              return map;
            },
            // (map, tokenInfo) => ({
            //   ...map,
            //   [fromENV(tokenInfo.chainId)]: {
            //     ...map[fromENV(tokenInfo.chainId)],
            //     [tokenInfo.address]: tokenInfo
            //   }
            // }),
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
