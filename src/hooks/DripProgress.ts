import { VaultAccount } from '@dcaf-labs/drip-sdk';
import BN from 'bn.js';
import { useMemo } from 'react';
import { VaultPositionAccountWithPubkey } from './Positions';

export function useDripProgress(
  vault?: VaultAccount | null,
  position?: VaultPositionAccountWithPubkey | null
): BN | undefined {
  return useMemo(() => {
    if (!vault || !position) return undefined;

    const totalDrips = position.numberOfSwaps;
    const completedDrips = BN.min(
      vault.lastDripPeriod.sub(position.dripPeriodIdBeforeDeposit),
      totalDrips
    );

    return completedDrips.muln(100).div(totalDrips);
  }, [vault, position]);
}
