import { Token } from '@dcaf-labs/drip-sdk';
import { useState, useEffect } from 'react';
import { QuoteToken } from '@dcaf-labs/drip-sdk';

export function useProfit(
  averagePrice: number,
  marketPrice: number,
  accruedTokenB: number,
  tokenBInfo: Token,
  quoteToken: QuoteToken = QuoteToken.TokenA
) {
  const [profit, setProfit] = useState(0);

  useEffect(() => {
    if (
      typeof averagePrice === 'number' &&
      typeof marketPrice === 'number' &&
      typeof accruedTokenB === 'number'
    ) {
      let priceRatio = marketPrice / averagePrice;
      if (tokenBInfo) {
        if (quoteToken === QuoteToken.TokenB) {
          priceRatio = 1 / priceRatio;
        }
      }
      setProfit(priceRatio * accruedTokenB);
    } else {
      console.log('averagePrice, marketPrice, and/or accruedTokenB are not numbers');
    }
  }, [averagePrice, marketPrice, accruedTokenB, tokenBInfo, quoteToken]);

  return profit;
}
