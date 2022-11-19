import { Skeleton, Text } from '@chakra-ui/react';
import { QuoteToken, Token } from '@dcaf-labs/drip-sdk';
import styled from 'styled-components';
import { useAverageDripPrice } from '../hooks/AverageDripPrice';
import { VaultPositionAccountWithPubkey } from '../hooks/Positions';
import { formatTokenAmount } from '../utils/token-amount';

interface AverageDripPriceProps {
  isPriceFlipped: boolean;
  position: VaultPositionAccountWithPubkey;
  tokenAInfo?: Token;
  tokenBInfo?: Token;
}

export function AverageDripPrice({
  isPriceFlipped,
  position,
  tokenAInfo,
  tokenBInfo
}: AverageDripPriceProps) {
  const averagePrice = useAverageDripPrice(
    position,
    isPriceFlipped ? QuoteToken.TokenB : QuoteToken.TokenA
  );
  return (
    <>
      {averagePrice && tokenAInfo && tokenBInfo ? (
        <>
          <StyledPriceValue>{`${formatTokenAmount(averagePrice, 0, true)}`}</StyledPriceValue>
          <Text w="5px" display="inline"></Text>
          <StyledPriceUnit>
            {isPriceFlipped
              ? `${tokenBInfo.symbol} per ${tokenAInfo.symbol}`
              : `${tokenAInfo.symbol} per ${tokenBInfo.symbol}`}
          </StyledPriceUnit>
        </>
      ) : (
        <Skeleton h="20px" w="100px" />
      )}
    </>
  );
}

const StyledPriceValue = styled(Text)`
  display: inline-block;
`;

const StyledPriceUnit = styled(Text)`
  display: inline-block;
  font-size: 13px;
  opacity: 60%;
`;
