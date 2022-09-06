import { Address } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { CoingeckoAPI } from '../api/coingecko';
import { toPubkey } from '../utils/pubkey';

export function useTokenMintMarketPriceUSD(mintPubKey: PublicKey): number | undefined {
  const [usdPrice, setPrice] = useState<number | undefined>(undefined);

  useEffect(() => {
    (async () => {
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
  }, [mintPubKey]);

  return usdPrice;
}
