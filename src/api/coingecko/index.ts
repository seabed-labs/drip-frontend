import axios from 'axios';

const BASE_URL = 'https://api.coingecko.com';
const USD_MINT_SOLANA_MAINNET = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const BLOCKCHAIN_NETWORK = 'solana';
const USD_CURRENCY = 'usd';

export type ValidDenominations = 'usd' | 'btc' | 'eth' | 'sol';

export class CoingeckoAPI {
  headers = {
    Accept: 'application/json'
  };

  async getUSDPriceForTokenByMint(
    mintAddresses: Array<string>
  ): Promise<Partial<Record<string, number | undefined>>> {
    const usdPricesByMint: Record<string, number | undefined> = {};

    const params = {
      contract_addresses: mintAddresses.join(','),
      vs_currencies: USD_CURRENCY
    };
    const { data } = await axios.get(
      `${BASE_URL}/api/v3/simple/token_price/${BLOCKCHAIN_NETWORK}`,
      { params, headers: this.headers }
    );
    mintAddresses.forEach((mintAddress) => {
      // For some reason, coinGecko doesn't return a value for USD mint
      if (mintAddress === USD_MINT_SOLANA_MAINNET) {
        usdPricesByMint[mintAddress] = 1;
      } else {
        if (!data[mintAddress] || !data[mintAddress][USD_CURRENCY]) {
          console.error(
            `Unexpected data from CoinGecko while fetching USD price for mint ${mintAddress} => ${data.toString()}`
          );
        }
        usdPricesByMint[mintAddress] = data[mintAddress][USD_CURRENCY];
      }
    });
    return usdPricesByMint;
  }

  async getUSDPriceForTokenByIds(
    coinGeckoIds: Array<string | undefined>
  ): Promise<Partial<Record<string, number>> | undefined> {
    coinGeckoIds = coinGeckoIds.filter((cgId) => {
      return cgId !== undefined;
    });

    if (coinGeckoIds.length == 0) {
      return undefined;
    }

    const priceByTokenMap: Record<string, number | undefined> = {};
    const params = {
      ids: coinGeckoIds.join(','),
      vs_currencies: USD_CURRENCY
    };
    const { data } = await axios.get(`${BASE_URL}/api/v3/simple/price/`, {
      params,
      headers: this.headers
    });
    for (const cgId in coinGeckoIds) {
      if (!data[cgId] || !data[cgId][USD_CURRENCY]) {
        console.error(
          `Unexpected data from CoinGecko while fetching USD price for id ${cgId} => ${data.toString()}`
        );
      }
      priceByTokenMap[cgId] = data[cgId][USD_CURRENCY] ?? undefined;
    }

    return priceByTokenMap;
  }
}
