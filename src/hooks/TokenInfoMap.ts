import { TokenInfo, TokenListProvider } from '@solana/spl-token-registry';
import { useEffect, useState } from 'react';
import { fromENV, Network } from '../models/Network';

export function useTokenInfoMap(): TokenInfoMap | undefined {
  const [tokenInfoMap, setTokenInfoMap] = useState<TokenInfoMap>({
    [Network.Mainnet]: {},
    [Network.Devnet]: {}
  });

  useEffect(() => {
    (async () => {
      const tokens = await new TokenListProvider().resolve();
      setTokenInfoMap((tokenInfoMap) => {
        return tokens.getList().reduce(
          (map, tokenInfo) => ({
            ...map,
            [fromENV(tokenInfo.chainId)]: {
              ...map[fromENV(tokenInfo.chainId)],
              [tokenInfo.address]: tokenInfo
            }
          }),
          tokenInfoMap
        );
      });
    })();
  }, [setTokenInfoMap]);

  return tokenInfoMap;
}

type TokenInfoMap = Record<Network, Partial<Record<string, TokenInfo>>>;
