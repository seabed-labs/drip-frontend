import { Image } from '@chakra-ui/react';
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

export const Header: FC = () => {
  return (
    <StyledContainer>
      <StyledLeftContainer>
        <StyledLogo src={Logo} />
      </StyledLeftContainer>
      <StyledRightContainer>
        <WalletMultiButton />
      </StyledRightContainer>
    </StyledContainer>
  );
};
