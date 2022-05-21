import { Granularity } from '@dcaf-protocol/drip-sdk/dist/interfaces/drip-admin/params';
import Decimal from 'decimal.js';
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

    const now = new Date();
    const dripDuration = Math.floor((endDate.getTime() - now.getTime()) / 1e3);
    const numCycles = Math.ceil(dripDuration / granularity);
    const dripAmount = new Decimal(amount).div(numCycles);

    return `${formatTokenAmountStr(
      numCycles.toString(),
      0,
      true
    )} drips of ${dripAmount.toSignificantDigits(
      3
    )} ${tokenA} to ${tokenB} every ${displayGranularity(granularity)}`;
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
