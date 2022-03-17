import { BN } from '@project-serum/anchor';
import Decimal from 'decimal.js';
import numeral from 'numeral';

export function formatTokenAmount(amount: BN, decimals: number): string {
  const amountDecimal = new Decimal(amount.toString()).div(new Decimal(10).pow(decimals));
  return numeral(amountDecimal.toString()).format('0.[00]a');
}
