import { Network } from '@dcaf-labs/drip-sdk/dist/models';
import { useEffect, useState } from 'react';
import { CoingeckoAPI } from '../api/coingecko';
import { useNetwork } from '../contexts/NetworkContext';

export function useTokenPairMarketPriceUSD(
  coinGeckoIDs: Array<string>
): Map<string, number> | undefined {
  const [usdPrices, setPrices] = useState<Map<string, number> | undefined>(undefined);
  const network = useNetwork();

  useEffect(() => {
    (async () => {
      if (!coinGeckoIDs || coinGeckoIDs.length != 2) {
        return;
      }
      if (network === Network.Devnet) {
        return -1;
      }
      const cgClient = new CoingeckoAPI();
      try {
        const priceByIds = await cgClient.getUSDPriceForTokenByIds(coinGeckoIDs);

        if (priceByIds?.size == 2) {
          setPrices(priceByIds);
        } else {
          console.log(`Unable to fetch market prices for token pair ${coinGeckoIDs.join(',')}`);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [coinGeckoIDs]);

  return usdPrices;
}
