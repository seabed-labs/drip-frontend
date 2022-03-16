import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { FC } from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

export const Header: FC = () => {
  return (
    <StyledContainer>
      <WalletMultiButton />
    </StyledContainer>
  );
};
