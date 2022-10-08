import { Granularity, expiryToNumberOfSwaps } from '@dcaf-labs/drip-sdk';
import Decimal from 'decimal.js';
import { useMemo } from 'react';
import { explainGranularity } from '../utils/granularity';
import { formatTokenAmount, formatTokenAmountStr } from '../utils/token-amount';

export function useDripPreviewText(
  tokenA?: string,
  tokenB?: string,
  amount?: string,
  granularity?: Granularity,
  endDate?: Date
): string | undefined {
  return useMemo(() => {
    if (!tokenA || !tokenB || !amount || !granularity || !endDate || Number(amount) === 0) {
      return undefined;
    }

    const numCycles = expiryToNumberOfSwaps(endDate, granularity);
    const dripAmount = new Decimal(amount).div(numCycles);

    const dripsStr = numCycles === 1 ? 'drip' : 'drips';
    const periodicDripAmountStr = formatTokenAmount(dripAmount, 0, true);
    return `${formatTokenAmountStr(
      numCycles.toString(),
      0,
      true
    )} ${dripsStr} of ${periodicDripAmountStr} ${tokenA} to ${tokenB} every ${explainGranularity(
      granularity,
      false
    )}`;
  }, [tokenA, tokenB, amount, granularity, endDate]);
}
