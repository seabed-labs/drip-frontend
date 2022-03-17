import { Grid, GridItem } from '@chakra-ui/react';
import { FC } from 'react';
import { PositionCard } from '../component/PositionCard';

interface Position {
  tokenA: string;
  tokenB: string;
}

function usePositions(): Position[] {
  return [
    {
      tokenA: 'USDC',
      tokenB: 'SOL'
    },
    {
      tokenA: 'USDC',
      tokenB: 'BTC'
    },
    {
      tokenA: 'USDC',
      tokenB: 'ETH'
    },
    {
      tokenA: 'USDC',
      tokenB: 'ETH'
    },
    {
      tokenA: 'USDC',
      tokenB: 'SOL'
    },
    {
      tokenA: 'USDC',
      tokenB: 'BTC'
    },
    {
      tokenA: 'USDC',
      tokenB: 'ETH'
    },
    {
      tokenA: 'USDC',
      tokenB: 'SOL'
    },
    {
      tokenA: 'USDC',
      tokenB: 'BTC'
    },
    {
      tokenA: 'USDC',
      tokenB: 'ETH'
    }
  ];
}

export const Positions: FC = () => {
  const positions = usePositions();

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap="80px">
      {positions.map((position) => (
        <GridItem mt="80px">
          <PositionCard></PositionCard>
        </GridItem>
      ))}
    </Grid>
  );
};
