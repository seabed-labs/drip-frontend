import axios from 'axios';

const BASE_URL = 'https://api.coingecko.com';
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
    if (!data[mintAddress][USD_CURRENCY]) {
      throw new Error(
        `Unexpected data from CoinGecko while fetching USD price for mint ${mintAddress} => ${data.toString()}`
      );
    }
    return data[mintAddress][USD_CURRENCY];
  }
}
