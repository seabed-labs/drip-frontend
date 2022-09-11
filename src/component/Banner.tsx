import { FC } from 'react';
import styled from 'styled-components';
import { Text } from '@chakra-ui/react';
import { useNetwork } from '../contexts/NetworkContext';
import { Network } from '@dcaf-labs/drip-sdk/dist/models';

const StyledContainer = styled.div`
  width: 100%;
  align-items: center;
  text-align: center;
  background-color: #62aaff;
`;

const StyledText = styled(Text)<{ selected: boolean }>`
  background: transparent !important;
  font-size: 20px !important;
  font-weight: 600;
`;

export const Banner: FC = () => {
  const network = useNetwork();
  return network !== Network.MainnetProd ? (
    <StyledContainer>
      <StyledText>Devnet</StyledText>
    </StyledContainer>
  ) : (
    <></>
  );
};
