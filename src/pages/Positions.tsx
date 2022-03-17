import { Box, Code, Grid, GridItem, Text } from '@chakra-ui/react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { FC, useEffect, useMemo, useState } from 'react';
import { PositionCard } from '../component/PositionCard';
import { useNetwork } from '../contexts/NetworkContext';
import { useVaultClient } from '../hooks/VaultClient';

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

function comparePosition(positionA: Position, positionB: Position): number {
  if (!positionA.isClosed && !positionB.isClosed) {
    return Buffer.compare(positionA.publicKey.toBuffer(), positionB.publicKey.toBuffer());
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

function usePositions() {
  const network = useNetwork();
  const wallet = useAnchorWallet();
  const vaultClient = useVaultClient(network);
  const [positionsRecord, setPositionsRecord] = useState<Record<string, Position>>();

  useEffect(() => {
    (async () => {
      if (!wallet) return;

      const positionsRecord = await vaultClient.getUserPositions();
      console.log(positionsRecord);
      setPositionsRecord(positionsRecord as Record<string, Position>);
    })();
  }, [wallet, vaultClient]);

  return useMemo(
    () =>
      Object.entries(positionsRecord ?? {})
        .map(([publicKey, data]) => ({ ...data, publicKey: new PublicKey(publicKey) }))
        .sort(comparePosition),
    [positionsRecord]
  );
}

export const Positions: FC = () => {
  const positions = usePositions();

  console.log(positions);

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap="80px">
      {positions.map((position) => (
        <GridItem key={position.publicKey.toBase58()} mt="80px">
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
