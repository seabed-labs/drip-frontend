import { Center, Grid, GridItem, Spinner, Text, VStack } from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { FC } from 'react';
import { PositionCard } from '../component/PositionCard';
import { usePositions } from '../hooks/Positions';

export const Positions: FC = () => {
  const { connected } = useWallet();
  const [positions, isPositionsLoading] = usePositions();

  if (!connected) {
    return (
      <Center h="calc(100vh - 180px)">
        <Text fontSize="26px" fontWeight="medium">
          Connect your wallet to see your positions
        </Text>
      </Center>
    );
  }

  if (isPositionsLoading && positions.length === 0) {
    return (
      <Center h="calc(100vh - 180px)">
        <VStack spacing="20px">
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="#62aaff" size="xl" />
          <Center w="100%">
            <Text>Loading Positions</Text>
          </Center>
        </VStack>
      </Center>
    );
  }

  if (positions.length === 0) {
    return (
      <Center h="calc(100vh - 177px)">
        <Text fontSize="26px" fontWeight="medium">
          You don't have any positions
        </Text>
      </Center>
    );
  }

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap="80px">
      {positions.map((position) => (
        <GridItem key={position.pubkey.toBase58()} mt="80px">
          <PositionCard position={position} />
        </GridItem>
      ))}
    </Grid>
  );
};
