import { Token } from '@dcaf-labs/drip-sdk';
import { useState, useEffect } from 'react';
import { QuoteToken } from '@dcaf-labs/drip-sdk';
import Decimal from 'decimal.js';

export function useProfit(
  averagePrice: Decimal | undefined,
  marketPrice: Decimal | undefined,
  accruedTokenB: Decimal | undefined,
  tokenBInfo: Token | undefined,
  quoteToken: QuoteToken
) {
  const [profit, setProfit] = useState(new Decimal(0));

  useEffect(() => {
    if (averagePrice && marketPrice && accruedTokenB && quoteToken) {
      let normalizedMarketPrice = marketPrice;
      let normalizedAveragePrice = averagePrice;

      if (tokenBInfo) {
        if (quoteToken === QuoteToken.TokenB) {
          normalizedMarketPrice = new Decimal(1).div(normalizedMarketPrice);
          normalizedAveragePrice = new Decimal(1).div(normalizedAveragePrice);
        }
      }

      const priceDelta = normalizedMarketPrice.sub(normalizedAveragePrice);
      const profit = priceDelta.mul(accruedTokenB);
      setProfit(profit);
    } else {
      console.log('averagePrice, marketPrice, accruedTokenB, and/or quoteToken are not valid');
    }
  }, [averagePrice, marketPrice, accruedTokenB, tokenBInfo, quoteToken]);

  return profit;
}
