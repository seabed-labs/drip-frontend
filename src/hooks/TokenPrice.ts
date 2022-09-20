import { Network } from '@dcaf-labs/drip-sdk/dist/models';
import { useEffect, useState } from 'react';
import { CoingeckoAPI } from '../api/coingecko';
import { useNetwork } from '../contexts/NetworkContext';

export function useTokenMintMarketPriceUSD(mintAddress?: string): number | undefined {
  const [usdPrice, setPrice] = useState<number | undefined>(undefined);
  const network = useNetwork();

  useEffect(() => {
    (async () => {
      if (!mintAddress) {
        return;
      }
      if (network === Network.Devnet) {
        return -1;
      }
      const cgClient = new CoingeckoAPI();
      try {
        const price = await cgClient.getUSDPriceForTokenByMint(mintAddress);

        if (price) {
          setPrice(price);
        } else {
          console.log(`Tried fetching price for ${mintAddress} from CoinGecko but got ${price}`);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [mintAddress]);

  return usdPrice;
}
