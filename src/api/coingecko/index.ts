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

  async getUSDPriceForTokenByMint(mintAddress: string): Promise<number | undefined> {
    // The API can support comma seperated mint addresses, but to keep the usage simple only allowing
    // a single mint for this function

    // For some reason, coinGecko doesn't return a value for USD mint
    if (mintAddress === USD_MINT_SOLANA_MAINNET) {
      return 1;
    }

    if (mintAddress.split(',').length != 1) {
      throw new Error('Please provide a single mint address.');
    }
    const params = {
      contract_addresses: mintAddress,
      vs_currencies: USD_CURRENCY
    };
    const { data } = await axios.get(
      `${BASE_URL}/api/v3/simple/token_price/${BLOCKCHAIN_NETWORK}`,
      { params, headers: this.headers }
    );
    if (!data[mintAddress] || !data[mintAddress][USD_CURRENCY]) {
      throw new Error(
        `Unexpected data from CoinGecko while fetching USD price for mint ${mintAddress} => ${data.toString()}`
      );
    }
    return data[mintAddress][USD_CURRENCY];
  }

  async getUSDPriceForTokenByIds(
    coinGeckoIDs: Array<string>
  ): Promise<Map<string, number> | undefined> {
    // The API can support comma seperated mint addresses, but to keep the usage simple only allowing
    // a single mint for this function
    if (coinGeckoIDs.length == 0) {
      throw new Error('Please provide atleast 1 coinGeckoID');
    }

    const priceByTokenMap = new Map<string, number>();
    const params = {
      ids: coinGeckoIDs.join(','),
      vs_currencies: USD_CURRENCY
    };
    const { data } = await axios.get(`${BASE_URL}/api/v3/simple/price/`, {
      params,
      headers: this.headers
    });
    for (const cgId in coinGeckoIDs) {
      if (!data[cgId] || !data[cgId][USD_CURRENCY]) {
        throw new Error(
          `Unexpected data from CoinGecko while fetching USD price for id ${cgId} => ${data.toString()}`
        );
      }
      priceByTokenMap.set(cgId, data[cgId][USD_CURRENCY]);
    }

    return priceByTokenMap;
  }
}
