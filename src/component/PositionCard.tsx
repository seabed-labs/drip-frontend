import { Box, Popover, PopoverContent, PopoverTrigger, Progress } from '@chakra-ui/react';
import { calculateWithdrawTokenBAmount } from '@dcaf/drip-sdk';
import { BN } from '@project-serum/anchor';
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import { FC } from 'react';
import styled from 'styled-components';
import { useAsyncMemo } from 'use-async-memo';
import { useNetwork } from '../contexts/NetworkContext';
import { useTokenMintInfo } from '../hooks/TokenMintInfo';
import { useVaultClient } from '../hooks/VaultClient';
import { useVaultInfo } from '../hooks/VaultInfo';
import { Position, VaultPositionAccountWithPubkey } from '../pages';
import { formatTokenAmount } from '../utils/token-amount';
import { getVaultPeriodPDA } from '../vault-client';

import Config from '../config.json';
import Decimal from 'decimal.js';
import { useDripContext } from '../contexts/DripContext';

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
  position: VaultPositionAccountWithPubkey;
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

  const aOverBDec = new Decimal(1).div(bOverADec).div(new Decimal(10).pow(tokenADecimals));
  return aOverBDec.toSignificantDigits(3).toString();
}

export const PositionCard: FC<Props> = ({ position }) => {
  const drip = useDripContext();
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
  }, [vaultClient, position]);

  const vaultProtoConfig = useAsyncMemo(async () => {
    if (!drip || !vaultInfo) {
      return undefined;
    }

    const [vaultProtoConfig] = await drip.querier.fetchVaultProtoConfigAccounts(
      vaultInfo.protoConfig
    );

    return vaultProtoConfig;
  }, [drip, vaultInfo]);

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
  }, [vaultClient, vaultInfo, position]);

  const accruedTokenB =
    vaultPeriodI && vaultPeriodJ && position && vaultProtoConfig
      ? calculateWithdrawTokenBAmount(
          vaultPeriodI.periodId,
          vaultPeriodJ.periodId,
          vaultPeriodI.twap,
          vaultPeriodJ.twap,
          position.periodicDripAmount,
          new BN(vaultProtoConfig.triggerDcaSpread)
        )
      : new BN(0);

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
            {tokenB && formatTokenAmount(accruedTokenB, tokenB.decimals, true)} {tokenBSymbol}
          </InfoValue>
        </InfoField>
        <InfoField>
          <InfoKey>Average Price</InfoKey>
          <InfoValue>
            {tokenA &&
              tokenB &&
              vaultPeriodJ &&
              // TODO: Show user THEIR avg price
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
