import { Button, Image } from '@chakra-ui/react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Logo from '../assets/logo.svg';
import Drip from '../assets/drip.svg';

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
  height: 100px;
`;

const StyledDrip = styled(Image)`
  height: 100px;
  transform: translateY(-10px);
`;

const StyledNavButton = styled(Button)<{ selected: boolean }>`
  width: 100px;
  background: transparent !important;
  font-size: 26px !important;
  color: ${(props) => (props.selected ? '#62aaff' : 'rgba(255, 255, 255, 0.6)')};
  text-decoration: ${(props) => (props.selected ? 'underline' : 'none')};

  &:hover {
    color: #62aaff;
    text-decoration: underline;
  }
`;

export const Header: FC = () => {
  const { pathname } = useLocation();

  return (
    <StyledContainer>
      <StyledLeftContainer>
        <StyledLogo src={Logo} />
        <StyledDrip src={Drip} />
      </StyledLeftContainer>
      <StyledMiddleContainer>
        <Link to="/deposit">
          <StyledNavButton selected={pathname === '/deposit'}>Deposit</StyledNavButton>
        </Link>
        <Link to="/positions">
          <StyledNavButton selected={pathname === '/positions'}>Positions</StyledNavButton>
        </Link>
      </StyledMiddleContainer>
      <StyledRightContainer>
        <WalletMultiButton />
      </StyledRightContainer>
    </StyledContainer>
  );
};
