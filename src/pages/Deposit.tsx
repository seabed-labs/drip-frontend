import { Center } from '@chakra-ui/react';
import { FC } from 'react';
import styled from 'styled-components';
import { DepositBox } from '../component/DepositBox2';
import { Device } from '../utils/ui/css';

const StyledContainer = styled(Center)`
  margin-top: 50px;

  @media ${Device.Laptop} {
    margin-top: 100px;
  }
`;

export const Deposit: FC = () => {
  return (
    <StyledContainer>
      <DepositBox />
    </StyledContainer>
  );
};
