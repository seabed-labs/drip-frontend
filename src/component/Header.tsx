import { Button, Image } from '@chakra-ui/react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Logo from '../assets/logo.svg';
import Drip from '../assets/drip.svg';
import { Device } from '../utils/ui/css';

const StyledContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StyledLeftContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  visibility: hidden;
  width: 0;

  @media ${Device.Tablet} {
    visibility: visible;
    width: 100%;
  }
`;

const StyledMiddleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: 100px;

  @media ${Device.Tablet} {
    width: 100%;
  }
`;

const StyledRightContainer = styled.div`
  width: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  visibility: hidden;

  @media ${Device.Tablet} {
    visibility: visible;
    width: 100%;
  }
`;

const StyledLogo = styled(Image)`
  height: 0;

  @media ${Device.Tablet} {
    height: 80px;
  }
`;

const StyledDrip = styled(Image)`
  transform: translateY(-10px);
  height: 0;

  @media ${Device.Tablet} {
    height: 80px;
  }
`;

const StyledNavButton = styled(Button)<{ selected: boolean }>`
  width: 100px;
  background: transparent !important;
  color: ${(props) => (props.selected ? '#62aaff' : 'rgba(255, 255, 255, 0.6)')};
  text-decoration: ${(props) => (props.selected ? 'underline' : 'none')};
  font-size: 22px !important;

  @media ${Device.MobileL} {
    font-size: 26px !important;
  }

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
