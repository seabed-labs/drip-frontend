import { VaultAccount } from '@dcaf-labs/drip-sdk';
import BN from 'bn.js';
import { useMemo } from 'react';
import { VaultPositionAccountWithPubkey } from './Positions';

export type DripProgress = {
  completedDrips: BN;
  totalDrips: BN;
  percentage: BN;
};

export function useDripProgress(
  vault?: VaultAccount | null,
  position?: VaultPositionAccountWithPubkey | null
): DripProgress | undefined {
  return useMemo(() => {
    if (!vault || !position) return undefined;

    const totalDrips = position.numberOfSwaps;
    const completedDrips = BN.min(
      vault.lastDripPeriod.sub(position.dripPeriodIdBeforeDeposit),
      totalDrips
    );

    const percentage = completedDrips.muln(100).div(totalDrips);
    return {
      completedDrips,
      totalDrips,
      percentage
    };
  }, [vault, position]);
}
