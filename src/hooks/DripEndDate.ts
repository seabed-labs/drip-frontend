import { VaultAccount, VaultPeriodAccount, VaultProtoConfigAccount } from '@dcaf-labs/drip-sdk';
import BN from 'bn.js';
import { useMemo } from 'react';
import { VaultPositionAccountWithPubkey } from './Positions';

export function usePositionEndDate(
  protoConfig?: VaultProtoConfigAccount | null,
  vault?: VaultAccount | null,
  position?: VaultPositionAccountWithPubkey | null,
  lastVaultPeriod?: VaultPeriodAccount | null
): Date | undefined {
  return useMemo(() => {
    //  Drip is completed, return end date time
    if (lastVaultPeriod && lastVaultPeriod.dripTimestamp.toNumber()) {
      return new Date(lastVaultPeriod.dripTimestamp.mul(new BN(1000)).toNumber());
    }
    // Drip is still in progress, return estimated end date time
    if (!vault || !protoConfig || !position) return undefined;
    const now = new Date();
    const totalDrips = position.numberOfSwaps;
    const completedDrips = BN.min(
      vault.lastDripPeriod.sub(position.dripPeriodIdBeforeDeposit),
      totalDrips
    );
    const remainingDrips = totalDrips.sub(completedDrips);

    if (remainingDrips.eqn(0)) {
      return undefined;
    }

    return new Date(
      now.getTime() + remainingDrips.toNumber() * protoConfig.granularity.toNumber() * 1e3
    );
  }, [protoConfig, vault, position, lastVaultPeriod]);
}
