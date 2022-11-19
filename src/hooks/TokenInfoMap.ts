import { Token } from '@dcaf-labs/drip-sdk';
import { PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { getDripApi } from '../api/drip';

export type TokenMap = Partial<Record<string, Token>>;

export function useTokenMap(): TokenMap | undefined {
  const [tokenMap, setTokenMap] = useState<TokenMap>();

  const dripApi = getDripApi();

  useEffect(() => {
    (async () => {
      const tokens = await dripApi.v1TokensGet();
      const tokenMap: TokenMap = {};
      tokens.forEach((token) => {
        tokenMap[token.pubkey] = {
          mint: new PublicKey(token.pubkey),
          decimals: token.decimals,
          symbol: token.symbol,
          iconUrl: token.iconUrl
        };
      });
      setTokenMap(tokenMap);
    })();
  }, [setTokenMap]);

  return tokenMap;
}
