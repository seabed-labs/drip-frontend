import axios from 'axios';
import { CoinGeckoClient } from 'coingecko-api-v3';

export type ValidDenominations = 'usd' | 'btc' | 'eth' | 'sol';

export class CoingeckoAPI {
  geckoClient: CoinGeckoClient;
  headers = {
    Accept: 'application/json'
  };

  constructor() {
    this.geckoClient = new CoinGeckoClient({
      timeout: 10000,
      autoRetry: true
    });
  }

  // Uses the third party sdk client to get price by tokenId
  // @param tokenId = 'solana' OR 'solana,ethereum'
  async getPriceForTokenById(tokenId: string, denomination: ValidDenominations): Promise<number> {
    const response = await this.geckoClient.simplePrice({
      ids: tokenId,
      vs_currencies: denomination
    });
    return response[tokenId][denomination];
  }

  async getUSDPriceForTokenByMint(mintAddress: string): Promise<number | undefined> {
    const currency = 'usd';
    const blockchainNetwork = 'solana';

    // The API can support comma seperated mint addresses, but to keep the usage simple only allowing
    // a single mint for this function
    if (mintAddress.split(',').length != 1) {
      throw Error('Please provide a single mint address.');
    }
    const params = {
      contract_addresses: mintAddress,
      vs_currencies: currency
    };
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/simple/token_price/${blockchainNetwork}`,
      { params, headers: this.headers }
    );
    return data[mintAddress][currency];
  }
}
