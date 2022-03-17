import { Box, Popover, PopoverContent, PopoverTrigger, Progress } from '@chakra-ui/react';
import { FC } from 'react';
import styled from 'styled-components';
import { useTokenMintInfo } from '../hooks/TokenMintInfo';
import { useVaultInfo } from '../hooks/VaultInfo';
import { Position } from '../pages';
import { formatTokenAmount } from '../utils/format';

const Container = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 40px;
  height: 280px;
  width: 367px;
  background: #101010;
  border-radius: 60px;
  box-shadow: 0 0 30px 1px rgba(49, 85, 128, 0.15);
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: white;
`;

const InProgressStatusPill = styled.div`
  width: 16px;
  height: 16px;
  background-color: #2775ca;
  border-radius: 20px;
`;

const DoneStatusPill = styled.div`
  width: 16px;
  height: 16px;
  background-color: rgba(62, 173, 73, 0.56);
  border-radius: 20px;
`;

const ClosedStatusPill = styled.div`
  width: 16px;
  height: 16px;
  background-color: green;
  border-radius: 20px;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const InfoField = styled.div<{ isFlexStart?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.isFlexStart ? 'flex-start' : 'flex-end')};
  justify-content: center;
`;

const InfoKey = styled.div`
  font-weight: bold;
  color: #62aaff;
`;

const InfoValue = styled.div``;

interface Props {
  position: Position;
}

export const PositionCard: FC<Props> = ({ position }) => {
  const vaultInfo = useVaultInfo(position.vault);
  const tokenA = useTokenMintInfo(vaultInfo?.tokenA);
  const tokenB = useTokenMintInfo(vaultInfo?.tokenB);
  const depositedTokenAAmountUi = tokenA
    ? formatTokenAmount(position.depositedTokenAAmount, tokenA?.decimals)
    : '';

  return (
    <Container>
      <Header>
        <Title>{depositedTokenAAmountUi} USDC → SOL</Title>
        {position.isClosed ? (
          <ClosedStatusPill />
        ) : vaultInfo?.lastDcaPeriod?.gte(
            position.dcaPeriodIdBeforeDeposit.add(position.numberOfSwaps)
          ) ? (
          <DoneStatusPill />
        ) : (
          <InProgressStatusPill />
        )}
      </Header>
      <Box my="15px" />
      <Row>
        <InfoField isFlexStart>
          <InfoKey>Accrued SOL</InfoKey> <InfoValue>125 SOL</InfoValue>
        </InfoField>
        <InfoField>
          <InfoKey>Average Price</InfoKey>
          <InfoValue>20 SOL per USDC</InfoValue>
        </InfoField>
      </Row>
      <Box my="15px" />
      <Row>
        <InfoField isFlexStart>
          <InfoValue>20% completed</InfoValue>
          <Progress mt="14px" width="150%" borderRadius="20px" height="8px" value={20} />
        </InfoField>
        <InfoField>
          <InfoKey>Withdrawn SOL</InfoKey>
          <InfoValue>20 SOL</InfoValue>
        </InfoField>
      </Row>
    </Container>
  );
};
