import { Grid, GridItem } from '@chakra-ui/react';
import { FC } from 'react';
import { PositionCard } from '../component/PositionCard';

export const Positions: FC = () => {
  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={6}>
      <GridItem mt="80px">
        <PositionCard></PositionCard>
      </GridItem>
      <GridItem mt="80px">
        <PositionCard></PositionCard>
      </GridItem>
      <GridItem mt="80px">
        <PositionCard></PositionCard>
      </GridItem>
      <GridItem mt="80px">
        <PositionCard></PositionCard>
      </GridItem>
      <GridItem mt="80px">
        <PositionCard></PositionCard>
      </GridItem>
      <GridItem mt="80px">
        <PositionCard></PositionCard>
      </GridItem>
    </Grid>
  );
};
