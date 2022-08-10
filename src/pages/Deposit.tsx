import { Center } from '@chakra-ui/react';
import { FC } from 'react';
import styled from 'styled-components';
import { DepositBox } from '../component/DepositBox2';
import { Device } from '../utils/ui/css';

const StyledContainer = styled(Center)`
  @media ${Device.Laptop} {
    margin-top: 100px;
  }

  @media ${Device.MobileS} {
    margin-top: 50px;
  }
`;

export const Deposit: FC = () => {
  return (
    <StyledContainer>
      <DepositBox />
    </StyledContainer>
  );
};
