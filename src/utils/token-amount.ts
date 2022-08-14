import { BN } from '@project-serum/anchor';
import Decimal from 'decimal.js';
import numeral from 'numeral';

Decimal.set({
  precision: 50
});

export function formatTokenAmountStr(amount: string, decimals: number, pretty = false): string {
  return formatTokenAmount(new BN(amount), decimals, pretty);
}

export function formatTokenAmount(amount: BN | Decimal, decimals: number, pretty = false): string {
  const amountDecimal = new Decimal(amount.toString()).div(new Decimal(10).pow(decimals));
  if (!pretty) {
    return amountDecimal.toString();
  }
  if (amountDecimal.lessThan(0.01) && amountDecimal.greaterThan(0)) {
    return numeral(amountDecimal.toString()).format('0.0e+0');
  } else {
    return formatDecimalTokenAmount(amountDecimal);
  }
}

export function formatDecimalTokenAmount(amount: Decimal): string {
  return numeral(amount.toString()).format('0.[00]a');
}

export function parseTokenAmount(amount: string, decimals: number): BN {
  const amountRawStr = new Decimal(amount).mul(new Decimal(10).pow(decimals)).round().toString();
  return new BN(amountRawStr);
}
