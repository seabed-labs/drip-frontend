import { useEffect, useState } from 'react';
import { CoingeckoAPI } from '../api/coingecko';
import { useNetwork } from '../contexts/NetworkContext';
import { Network } from '../models/Network';

export function useTokenMintMarketPriceUSD(mintAddress?: string): number | undefined {
  const [usdPrice, setPrice] = useState<number>();
  const network = useNetwork();

  useEffect(() => {
    (async () => {
      if (!mintAddress || network == Network.Devnet) {
        return;
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
