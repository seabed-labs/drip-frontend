import { Box, Center, Text } from '@chakra-ui/react';
import { PublicKey } from '@solana/web3.js';
import { useState } from 'react';
import styled from 'styled-components';
import { useTokenAs, useTokenBs } from '../hooks/Tokens';
import { TokenSelector } from './TokenSelect';

const StyledContainer = styled.div`
  padding: 40px;
  width: 500px;
  background: #101010;
  border-radius: 60px;
  box-shadow: 0 0 128px 1px rgba(98, 170, 255, 0.15);
`;

const StyledMainRowContainer = styled.div`
  width: 100%;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledSubRowContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export function DepositBox() {
  const [tokenA, setTokenA] = useState<PublicKey>();
  const [tokenB, setTokenB] = useState<PublicKey>();

  const tokenAs = useTokenAs();
  const tokenBs = useTokenBs(tokenA);

  return (
    <StyledContainer>
      <StyledMainRowContainer>
        <StyledSubRowContainer>
          <Text>Drip</Text>
          <Text>{'[Max Button]'}</Text>
        </StyledSubRowContainer>
        <Box h="10px" />
        <StyledSubRowContainer>
          <TokenSelector
            modalTitle="Select Token A"
            placeholder="Select Token A"
            onSelectToken={(token) => {
              setTokenA(token);
              if (tokenB) {
                setTokenB(undefined);
              }
            }}
            selectedToken={tokenA}
            tokens={tokenAs}
          />
          <Text>{'[Amount Input]'}</Text>
        </StyledSubRowContainer>
      </StyledMainRowContainer>
      <StyledMainRowContainer>
        <StyledSubRowContainer>
          <Text>To</Text>
        </StyledSubRowContainer>
        <StyledSubRowContainer>
          <TokenSelector
            modalTitle="Select Token B"
            placeholder="Select Token B"
            onSelectToken={setTokenB}
            selectedToken={tokenB}
            tokens={tokenBs}
          />
          <Text>{'[Granularity Select]'}</Text>
        </StyledSubRowContainer>
      </StyledMainRowContainer>
      <StyledMainRowContainer>
        <StyledSubRowContainer>
          <Text>Till</Text>
        </StyledSubRowContainer>
        <StyledSubRowContainer>
          <Center w="100%">
            <Text>{'[Date Picker]'}</Text>
          </Center>
        </StyledSubRowContainer>
      </StyledMainRowContainer>
      <Box h="20px" />
      <StyledMainRowContainer>
        <StyledSubRowContainer>
          <Center w="100%">
            <Text>{'[DCA Preview]'}</Text>
          </Center>
        </StyledSubRowContainer>
        <StyledSubRowContainer>
          <Center w="100%">
            <Text>{'[Deposit Button]'}</Text>
          </Center>
        </StyledSubRowContainer>
      </StyledMainRowContainer>
    </StyledContainer>
  );
}
