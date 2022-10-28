import { QuoteToken } from '@dcaf-labs/drip-sdk';
import Decimal from 'decimal.js';
import { useAsyncMemo } from 'use-async-memo';
import { useDripContext } from '../contexts/DripContext';
import { VaultPositionAccountWithPubkey } from './Positions';

export function useAverageDripPrice(
  position?: VaultPositionAccountWithPubkey | null,
  quoteToken: QuoteToken = QuoteToken.TokenA
): Decimal | undefined {
  const drip = useDripContext();
  return useAsyncMemo(() => {
    if (!position) return undefined;
    return drip?.querier.getAveragePrice(position.pubkey, quoteToken);
  }, [drip, position, quoteToken]);
}
