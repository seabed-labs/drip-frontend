import { Center } from '@chakra-ui/react';
import { FC } from 'react';
import { DepositBox } from '../component/DepositBox';

export const Deposits: FC = () => {
  return (
    <Center mt="100px">
      <DepositBox />
    </Center>
  );
};
