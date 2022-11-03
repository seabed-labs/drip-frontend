import { Network } from '@dcaf-labs/drip-sdk/dist/models';
import { useEffect, useState } from 'react';
import { CoingeckoAPI } from '../api/coingecko';
import { useNetwork } from '../contexts/NetworkContext';

export function useTokensMarketPriceUSD(
  coinGeckoIds: Array<string | undefined>
): Partial<Record<string, number> | undefined> {
  const [usdPrices, setPrices] = useState<Partial<Record<string, number> | undefined>>(undefined);
  const network = useNetwork();

  useEffect(() => {
    (async () => {
      let priceByIds = undefined;
      if (network === Network.Devnet) {
        return -1;
      }
      const cgClient = new CoingeckoAPI();
      try {
        if (coinGeckoIds) {
          priceByIds = await cgClient.getUSDPriceForTokenByIds(coinGeckoIds);
        }

        setPrices(priceByIds);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [coinGeckoIds]);

  return usdPrices;
}
