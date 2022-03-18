import { Box, Popover, PopoverContent, PopoverTrigger, Progress } from '@chakra-ui/react';
import { BN } from '@project-serum/anchor';
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import { FC } from 'react';
import styled from 'styled-components';
import { useAsyncMemo } from 'use-async-memo';
import { useNetwork } from '../contexts/NetworkContext';
import { useTokenMintInfo } from '../hooks/TokenMintInfo';
import { useVaultClient } from '../hooks/VaultClient';
import { useVaultInfo } from '../hooks/VaultInfo';
import { Position } from '../pages';
import { formatTokenAmount } from '../utils/format';
import { getVaultPeriodPDA } from '../vault-client';

import Config from '../config.json';
import Decimal from 'decimal.js';

interface VaultConfig {
  vault: string;
  vaultTokenAAccount: string;
  vaultTokenBAccount: string;
  vaultProtoConfig: string;
  vaultProtoConfigGranularity: number;
  tokenAMint: string;
  tokenASymbol: string;
  tokenBMint: string;
  tokenBSymbol: string;
}
const vaultConfigs = Config as VaultConfig[];

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

function getAccruedTokenB(i: BN, j: BN, twapI: BN, twapJ: BN, dripAmount: BN): BN {
  if (i.eq(j)) {
    return new BN(0);
  }
  const averagePriveFromStart = twapJ.mul(j).sub(twapI.mul(i)).div(j.sub(i));
  const drippedSoFar = dripAmount.mul(j.sub(i));
  const amount = averagePriveFromStart.mul(drippedSoFar);
  return amount;
}

function getPercentageDripped(i: BN, j: BN, dripAmount: BN, deposit: BN): Decimal {
  if (i.eq(j)) {
    return new Decimal(0);
  }
  const drippedSoFar = dripAmount.mul(j.sub(i));
  return new Decimal(drippedSoFar.mul(new BN(100)).toString()).div(new Decimal(deposit.toString()));
}

function getAOverBPrice(bOverA: BN, tokenADecimals: number, tokenBDecimals: number): string {
  const bOverADec = new Decimal(bOverA.toString())
    .div(new Decimal(2).pow(64))
    .div(new Decimal(10).pow(tokenBDecimals));

  const aOverBDec = new Decimal(1).div(bOverADec);
  return aOverBDec.toSignificantDigits(3).toString();
}

export const PositionCard: FC<Props> = ({ position }) => {
  const vaultInfo = useVaultInfo(position.vault);
  const tokenA = useTokenMintInfo(vaultInfo?.tokenA);
  const tokenB = useTokenMintInfo(vaultInfo?.tokenB);
  const network = useNetwork();
  const vaultClient = useVaultClient(network);

  const vaultPeriodI = useAsyncMemo(() => {
    const vaultPeriod = getVaultPeriodPDA(
      vaultClient.program.programId,
      position.vault,
      position.dcaPeriodIdBeforeDeposit
    );

    return vaultClient.program.account.vaultPeriod.fetch(vaultPeriod.publicKey);
  }, [vaultClient]);

  const vaultPeriodJ = useAsyncMemo(() => {
    if (!vaultInfo) {
      return undefined;
    }
    const vaultPeriod = getVaultPeriodPDA(
      vaultClient.program.programId,
      position.vault,
      BN.min(position.dcaPeriodIdBeforeDeposit.add(position.numberOfSwaps), vaultInfo.lastDcaPeriod)
    );

    return vaultClient.program.account.vaultPeriod.fetch(vaultPeriod.publicKey);
  }, [vaultClient]);

  const accruedTokenB =
    vaultPeriodI && vaultPeriodJ
      ? getAccruedTokenB(
          vaultPeriodI.periodId,
          vaultPeriodJ.periodId,
          vaultPeriodI.twap,
          vaultPeriodJ.twap,
          position.periodicDripAmount
        )
      : new BN(0);
  console.log(accruedTokenB.toString());

  const percentageDripped =
    vaultPeriodI && vaultPeriodJ
      ? getPercentageDripped(
          vaultPeriodI.periodId,
          vaultPeriodJ.periodId,
          position.periodicDripAmount,
          position.depositedTokenAAmount
        )
          .toSignificantDigits(3)
          .toString()
      : new BN(0);

  const depositedTokenAAmountUi = tokenA
    ? formatTokenAmount(position.depositedTokenAAmount, tokenA?.decimals)
    : '';

  const tokenASymbol = vaultConfigs.find(
    (c) => c.tokenAMint == vaultInfo?.tokenA.toString()
  )?.tokenASymbol;
  const tokenBSymbol = vaultConfigs.find(
    (c) => c.tokenBMint == vaultInfo?.tokenB.toString()
  )?.tokenBSymbol;
  return (
    <Container>
      <Header>
        <Title>
          {depositedTokenAAmountUi} {tokenASymbol} → {tokenBSymbol}
        </Title>
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
          <InfoKey>Accrued {tokenBSymbol}</InfoKey>{' '}
          <InfoValue>
            {tokenB && formatTokenAmount(accruedTokenB, tokenB?.decimals)} {tokenBSymbol}
          </InfoValue>
        </InfoField>
        <InfoField>
          <InfoKey>Average Price</InfoKey>
          <InfoValue>
            {tokenA &&
              tokenB &&
              vaultPeriodJ &&
              getAOverBPrice(vaultPeriodJ.twap, tokenA.decimals, tokenB.decimals)}{' '}
            {tokenASymbol} per {tokenBSymbol}
          </InfoValue>
        </InfoField>
      </Row>
      <Box my="15px" />
      <Row>
        <InfoField isFlexStart>
          <InfoValue>{`${percentageDripped}% completed`}</InfoValue>
          <Progress
            mt="14px"
            width="150%"
            borderRadius="20px"
            height="8px"
            value={Number(percentageDripped)}
          />
        </InfoField>
        <InfoField>
          <InfoKey>Withdrawn {tokenBSymbol}</InfoKey>
          <InfoValue>
            {tokenB && formatTokenAmount(position.withdrawnTokenBAmount, tokenB.decimals)}{' '}
            {tokenBSymbol}
          </InfoValue>
        </InfoField>
      </Row>
    </Container>
  );
};
