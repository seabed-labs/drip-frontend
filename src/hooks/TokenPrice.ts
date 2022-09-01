import { Address } from '@project-serum/anchor';
import { useEffect, useState } from 'react';
import { CoingeckoAPI } from '../api/coingecko';
import { toPubkey } from '../utils/pubkey';

export function useTokenMintMarketPriceUSD(address: Address): number | undefined {
  const [usdPrice, setPrice] = useState<number>();

  const addressStr = address?.toString();

  useEffect(() => {
    (async () => {
      const mintPubKey = toPubkey(addressStr);
      const cgClient = new CoingeckoAPI();
      try {
        const price = await cgClient.getUSDPriceForTokenByMint(mintPubKey.toString());

        if (price) {
          setPrice(price);
        } else {
          console.log(
            `Tried fetching price for ${mintPubKey.toString()} from CoinGecko but got ${price}`
          );
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [addressStr]);

  return usdPrice;
}
