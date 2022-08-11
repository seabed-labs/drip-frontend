import { Granularity, expiryToNumberOfSwaps } from '@dcaf-labs/drip-sdk';
import Decimal from 'decimal.js';
import numeral from 'numeral';
import { useMemo } from 'react';
import { formatTokenAmountStr } from '../utils/token-amount';

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

    return `${formatTokenAmountStr(numCycles.toString(), 0, true)} ${dripsStr} of ${numeral(
      dripAmount.toDecimalPlaces(3).toString()
    ).format('0.[000000]a')} ${tokenA} to ${tokenB} every ${displayGranularity(granularity)}`;
  }, [tokenA, tokenB, amount, granularity, endDate]);
}

function displayGranularity(granularity: Granularity): string {
  switch (granularity) {
    case Granularity.Minutely:
      return 'minute';
    case Granularity.Hourly:
      return 'hour';
    case Granularity.Daily:
      return 'day';
    case Granularity.Weekly:
      return 'week';
    case Granularity.Monthly:
      return 'month';
    case Granularity.Yearly:
      return 'year';
  }
}
