import { Button, Image } from '@chakra-ui/react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { FC } from 'react';
import styled from 'styled-components';
import Logo from '../assets/logo.svg';

const StyledContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StyledLeftContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const StyledMiddleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

const StyledRightContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const StyledLogo = styled(Image)`
  width: 120px;
`;

const StyledNavButton = styled(Button)`
  width: 100px;
  background: transparent !important;
  font-size: 26px !important;
  color: rgba(255, 255, 255, 0.6);

  &:hover {
    color: #62aaff;
    text-decoration: underline;
  }
`;

export const Header: FC = () => {
  return (
    <StyledContainer>
      <StyledLeftContainer>
        <StyledLogo src={Logo} />
      </StyledLeftContainer>
      <StyledMiddleContainer>
        <StyledNavButton>Deposit</StyledNavButton>
        <StyledNavButton>Positions</StyledNavButton>
      </StyledMiddleContainer>
      <StyledRightContainer>
        <WalletMultiButton />
      </StyledRightContainer>
    </StyledContainer>
  );
};
