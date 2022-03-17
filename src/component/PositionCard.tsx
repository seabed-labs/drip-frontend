import { FC } from 'react';
import styled from 'styled-components';
import { useTokenMintInfo } from '../hooks/TokenMintInfo';
import { useVaultInfo } from '../hooks/VaultInfo';
import { Position } from '../pages';
import { formatTokenAmount } from '../utils/format';

const Container = styled.div`
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
    </Container>
  );
};
