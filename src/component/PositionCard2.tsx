import { Text, Box, HStack, Image } from '@chakra-ui/react';
import styled from 'styled-components';
import { useAsyncMemo } from 'use-async-memo';
import { useDripContext } from '../contexts/DripContext';
import { useNetworkAddress } from '../hooks/CurrentNetworkAddress';
import { VaultPositionAccountWithPubkey } from '../hooks/Positions';
import { useTokenInfo } from '../hooks/TokenInfo';

export function PositionCard({ position }: PositionCardProps) {
  const drip = useDripContext();
  const [vault] =
    useAsyncMemo(async () => drip?.querier.fetchVaultAccounts(position.vault), [drip, position]) ??
    [];

  const tokenAAddr = useNetworkAddress(vault?.tokenAMint);
  const tokenBAddr = useNetworkAddress(vault?.tokenBMint);
  const tokenAInfo = useTokenInfo(tokenAAddr);
  const tokenBInfo = useTokenInfo(tokenBAddr);

  return (
    <StyledContainer>
      <StyledHeaderContainer>
        <HStack>
          <StyledTokenIcon src={tokenAInfo?.logoURI} />
          <Text>{tokenAInfo?.symbol}</Text>
        </HStack>
        <Text>→</Text>
        <HStack>
          <StyledTokenIcon src={tokenBInfo?.logoURI} />
          <Text>{tokenBInfo?.symbol}</Text>
        </HStack>
      </StyledHeaderContainer>
    </StyledContainer>
  );
}

interface PositionCardProps {
  position: VaultPositionAccountWithPubkey;
}

const StyledContainer = styled(Box)`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 30px;
  width: 367px;
  background: #101010;
  border-radius: 30px;
  box-shadow: 0 0 30px 1px rgba(49, 85, 128, 0.15);
`;

const StyledHeaderContainer = styled(Box)`
  width: 100%;
  font-size: 32px;
  font-weight: bold;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StyledTokenIcon = styled(Image)`
  width: 32px;
  border-radius: 50px;
`;
