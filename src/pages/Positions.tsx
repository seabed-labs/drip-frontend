import { Grid, GridItem } from '@chakra-ui/react';
import { VaultPositionAccount } from '@dcaf-protocol/drip-sdk/dist/interfaces/drip-querier/results';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { FC, useEffect, useMemo, useState } from 'react';
import { PositionCard } from '../component/PositionCard';
import { useDripContext } from '../contexts/DripContext';

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

function comparePosition(
  positionA: VaultPositionAccountWithPubkey,
  positionB: VaultPositionAccountWithPubkey
): number {
  if (!positionA.isClosed && !positionB.isClosed) {
    return Buffer.compare(positionA.pubkey.toBuffer(), positionB.pubkey.toBuffer());
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

function usePositions(): (VaultPositionAccount & { pubkey: PublicKey })[] {
  const drip = useDripContext();
  const wallet = useAnchorWallet();
  const [positionsRecord, setPositionsRecord] = useState<Record<string, VaultPositionAccount>>();

  useEffect(() => {
    (async () => {
      if (!drip || !wallet) {
        console.log('Not loaded', {
          drip,
          wallet
        });
        return;
      }

      setPositionsRecord(await drip.querier.getAllPositions(wallet.publicKey));
    })();
  }, [drip, wallet]);

  return useMemo(
    () =>
      Object.entries(positionsRecord ?? {})
        .map(([publicKey, data]) => ({ ...data, pubkey: new PublicKey(publicKey) }))
        .sort(comparePosition),
    [positionsRecord]
  );
}

export const Positions: FC = () => {
  const positions = usePositions();

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap="80px">
      {positions.map((position) => (
        <GridItem key={position.pubkey.toBase58()} mt="80px">
          <PositionCard position={position} />
          {/* <Box>
            <Box>
              <Text>Public Key:</Text>
              <Code>{position.publicKey.toBase58()}</Code>
            </Box>
            <Box>
              <Text>Closed</Text>
              <Code>{position.isClosed == false ? 'false' : 'true'}</Code>
            </Box>
          </Box> */}
        </GridItem>
      ))}
    </Grid>
  );
};
