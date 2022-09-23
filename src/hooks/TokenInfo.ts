import { Token } from '@dcaf-labs/drip-sdk';
import { PublicKey } from '@solana/web3.js';
import { useAsyncMemo } from 'use-async-memo';
import { getDripApi } from '../api/drip';
import { useDripContext } from '../contexts/DripContext';
import { NetworkAddress } from '../models/NetworkAddress';
import { useRemappedMint } from './MintRemap';

function getIconUrl(mint: string) {
  return `https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/${mint}/logo.png`;
}

export function useTokenInfo(mint?: NetworkAddress): Token | undefined {
  const remappedMint = useRemappedMint(mint);
  const drip = useDripContext();

  const dripApi = getDripApi();

  const token = useAsyncMemo(async () => {
    if (mint) {
      const apiToken = await dripApi.v1TokenPubkeyPathGet({
        pubkeyPath: mint?.address.toString()
      });

      const token = {
        mint: new PublicKey(apiToken.pubkey),
        decimals: apiToken.decimals,
        symbol: apiToken.symbol,
        iconUrl: apiToken.iconUrl
      };

      if (!token?.iconUrl && remappedMint) {
        token.iconUrl = getIconUrl(remappedMint.address.toString());
      }

      return token;
    }
  }, [mint?.toPrimitiveDep(), drip, remappedMint]);

  return token;
}
