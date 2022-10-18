import { Token as SdkToken } from '@dcaf-labs/drip-sdk';
import { PublicKey } from '@solana/web3.js';
import { useAsyncMemo } from 'use-async-memo';
import { getDripApi } from '../api/drip';
import { useDripContext } from '../contexts/DripContext';
import { useTokenMapContext } from '../contexts/TokenMap';
import { NetworkAddress } from '../models/NetworkAddress';
import { getDefaultIconUrl } from '../utils/token';
import { useRemappedMint } from './MintRemap';

export interface Token extends SdkToken {
  coinGeckoId?: string;
}

export function useTokenInfo(mint?: NetworkAddress): Token | undefined {
  const tokenMap = useTokenMapContext();

  const remappedMint = useRemappedMint(mint);
  const drip = useDripContext();

  const dripApi = getDripApi();

  const token = useAsyncMemo(async () => {
    if (mint) {
      let token: Token | undefined;

      if (tokenMap && tokenMap[mint.address.toString()]) {
        token = tokenMap[mint.address.toString()];
      } else {
        const apiToken = await dripApi.v1TokenPubkeyPathGet({
          pubkeyPath: mint.address.toString()
        });
        token = {
          mint: new PublicKey(apiToken.pubkey),
          decimals: apiToken.decimals,
          symbol: apiToken.symbol,
          iconUrl: apiToken.iconUrl,
          coinGeckoId: apiToken.coinGeckoId
        };
      }

      if (token && !token.iconUrl && remappedMint) {
        token.iconUrl = getDefaultIconUrl(remappedMint.address.toString());
      }

      return token;
    }
  }, [mint?.toPrimitiveDep(), drip, remappedMint, tokenMap]);

  return token;
}
