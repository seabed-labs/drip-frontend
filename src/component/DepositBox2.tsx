import { Box, Button, Center, PropsOf, Text } from '@chakra-ui/react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useEffect } from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { useNetworkAddress } from '../hooks/CurrentNetworkAddress';
import { useTokenBalance } from '../hooks/TokenBalance';
import { useTokenAs, useTokenBs } from '../hooks/Tokens';
import { formatTokenAmountStr } from '../utils/token-amount';
import { TokenAmountInput } from './TokenAmountInput';
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

const StyledStepHeader = styled(Text)`
  font-weight: bold;
  font-size: 22px;
`;

export function DepositBox() {
  const [tokenA, setTokenA] = useState<PublicKey>();
  const [tokenB, setTokenB] = useState<PublicKey>();
  const [depositAmountStr, setDepositAmountStr] = useState<string>();
  const wallet = useAnchorWallet();
  const tokenANetworkAddress = useNetworkAddress(tokenA);
  const maximumAmount = useTokenBalance(wallet?.publicKey, tokenANetworkAddress);

  const tokenAs = useTokenAs();
  const tokenBs = useTokenBs(tokenA);

  useEffect(() => console.log('Deposit Amount:', depositAmountStr), [depositAmountStr]);

  return (
    <StyledContainer>
      <StyledMainRowContainer>
        <StyledSubRowContainer>
          <StyledStepHeader>Drip</StyledStepHeader>
          {maximumAmount && (
            <Button
              h="20px"
              transition="0.2s ease"
              color="whiteAlpha.800"
              variant="unstyled"
              cursor="pointer"
              onClick={() => {
                setDepositAmountStr(
                  maximumAmount.uiAmountString ??
                    formatTokenAmountStr(maximumAmount.amount, maximumAmount.decimals)
                );
              }}
              _hover={{ color: 'white', textDecoration: 'underline', transition: '0.2s ease' }}
            >
              Max: {formatTokenAmountStr(maximumAmount.amount, maximumAmount.decimals, true)}
            </Button>
          )}
        </StyledSubRowContainer>
        <Box h="10px" />
        <StyledSubRowContainer>
          <TokenSelector
            modalTitle="Select Token A"
            placeholder="Select Token A"
            onSelectToken={(token) => {
              setTokenA(token);
              setTokenB(undefined);
            }}
            selectedToken={tokenA}
            tokens={tokenAs}
          />
          <TokenAmountInput
            amount={depositAmountStr}
            onUpdate={(value) => {
              setDepositAmountStr(value);
            }}
            disabled={!tokenA}
          />
        </StyledSubRowContainer>
      </StyledMainRowContainer>
      <StyledMainRowContainer>
        <StyledSubRowContainer>
          <StyledStepHeader>To</StyledStepHeader>
        </StyledSubRowContainer>
        <Box h="10px" />
        <StyledSubRowContainer>
          <TokenSelector
            disabled={!tokenA}
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
          <StyledStepHeader>Till</StyledStepHeader>
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
