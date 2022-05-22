import { useEffect, useState, useMemo } from 'react';
import { VaultPositionAccount } from '@dcaf-protocol/drip-sdk/dist/interfaces/drip-querier/results';
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { useDripContext } from '../contexts/DripContext';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { useStateRefresh } from './StateRefresh';

export interface Position {
  vault: PublicKey;
  publicKey: PublicKey;
  positionAuthority: PublicKey;
  depositedTokenAAmount: BN;
  withdrawnTokenBAmount: BN;
  depositTimestamp: BN;
  dcaPeriodIdBeforeDeposit: BN;
  numberOfSwaps: BN;
  periodicDripAmount: BN;
  isClosed: boolean;
}

export type VaultPositionAccountWithPubkey = VaultPositionAccount & { pubkey: PublicKey };

export function usePositions(): [positions: VaultPositionAccountWithPubkey[], loading: boolean] {
  const [loading, setLoading] = useState(true);
  const drip = useDripContext();
  const wallet = useAnchorWallet();
  const [positionsRecord, setPositionsRecord] = useState<Record<string, VaultPositionAccount>>();
  const { connected } = useWallet();
  const refreshTrigger = useStateRefresh();

  useEffect(() => {
    if (!connected) {
      setPositionsRecord(undefined);
      setLoading(true);
    }
  }, [positionsRecord]);

  useEffect(() => {
    (async () => {
      if (!drip || !wallet) {
        return;
      }

      setPositionsRecord(await drip.querier.getAllPositions(wallet.publicKey));
      setLoading(false);
    })();
  }, [drip, wallet, refreshTrigger]);

  const positions = useMemo(
    () =>
      Object.entries(positionsRecord ?? {})
        .map(([publicKey, data]) => ({ ...data, pubkey: new PublicKey(publicKey) }))
        .sort(comparePosition),
    [positionsRecord]
  );

  return [positions, loading];
}

function comparePosition(
  positionA: VaultPositionAccountWithPubkey,
  positionB: VaultPositionAccountWithPubkey
): number {
  if (!positionA.isClosed && !positionB.isClosed) {
    return positionB.depositTimestamp.toNumber() - positionA.depositTimestamp.toNumber();
  } else if (positionA.isClosed && !positionB.isClosed) {
    // A > B
    return 1;
  } else if (!positionA.isClosed && positionB.isClosed) {
    // A < B
    return -1;
  } else {
    // A = B
    return 0;
  }
}
