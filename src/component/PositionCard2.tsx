import { Text, Box, HStack, Image, Skeleton, Progress } from '@chakra-ui/react';
import { BN } from '@project-serum/anchor';
import { useMemo } from 'react';
import styled from 'styled-components';
import { useAsyncMemo } from 'use-async-memo';
import { useDripContext } from '../contexts/DripContext';
import { useNetworkAddress } from '../hooks/CurrentNetworkAddress';
import { VaultPositionAccountWithPubkey } from '../hooks/Positions';
import { useTokenInfo } from '../hooks/TokenInfo';
import { formatTokenAmount } from '../utils/token-amount';
import { displayGranularity } from './GranularitySelect';

export function PositionCard({ position }: PositionCardProps) {
  const drip = useDripContext();
  const [vault] =
    useAsyncMemo(async () => drip?.querier.fetchVaultAccounts(position.vault), [drip, position]) ??
    [];

  const [protoConfig] =
    useAsyncMemo(
      async () => vault && drip?.querier.fetchVaultProtoConfigAccounts(vault.protoConfig),
      [drip, vault]
    ) ?? [];

  const tokenAAddr = useNetworkAddress(vault?.tokenAMint);
  const tokenBAddr = useNetworkAddress(vault?.tokenBMint);
  const tokenAInfo = useTokenInfo(tokenAAddr);
  const tokenBInfo = useTokenInfo(tokenBAddr);

  const dripProgress = useMemo(() => {
    if (!vault) return undefined;

    const totalDrips = position.numberOfSwaps;
    const completedDrips = BN.min(
      vault.lastDcaPeriod.sub(position.dcaPeriodIdBeforeDeposit),
      totalDrips
    );

    return completedDrips.muln(100).div(totalDrips);
  }, [vault, position]);

  const estimatedEndDate = useMemo(() => {
    if (!vault || !protoConfig) return undefined;

    const positionStartDate = new Date(position.depositTimestamp.toNumber() * 1e3);
    const totalDrips = position.numberOfSwaps;
    const completedDrips = BN.min(
      vault.lastDcaPeriod.sub(position.dcaPeriodIdBeforeDeposit),
      totalDrips
    );
    const remainingDrips = totalDrips.sub(completedDrips);

    return new Date(
      positionStartDate.getTime() +
        remainingDrips.toNumber() * protoConfig.granularity.toNumber() * 1e3
    );
  }, [position, vault, protoConfig]);

  return (
    <StyledContainer>
      <StyledHeaderContainer>
        <HStack>
          {tokenAInfo ? (
            <>
              <StyledTokenIcon
                fallback={<Skeleton borderRadius="50px" w="32px" h="32px" />}
                src={tokenAInfo.logoURI}
              />
              <Text>{tokenAInfo.symbol}</Text>
            </>
          ) : (
            <Skeleton h="40px" w="120px" />
          )}
        </HStack>
        <Text>→</Text>
        <HStack>
          {tokenBInfo ? (
            <>
              <StyledTokenIcon
                src={tokenBInfo.logoURI}
                fallback={<Skeleton borderRadius="50px" w="32px" h="32px" />}
              />
              <Text>{tokenBInfo.symbol}</Text>
            </>
          ) : (
            <Skeleton h="40px" w="120px" />
          )}
        </HStack>
      </StyledHeaderContainer>
      <StyledBodyContainer>
        <StyledDataRow>
          <StyledDataKey>Deposit</StyledDataKey>
          {tokenAInfo ? (
            <Text>
              {formatTokenAmount(position.depositedTokenAAmount, tokenAInfo?.decimals, true)} USDC
            </Text>
          ) : (
            <Skeleton h="20px" w="100px" />
          )}
        </StyledDataRow>
        <StyledDataRow>
          <StyledDataKey>Open Date</StyledDataKey>
          {tokenAInfo ? (
            <Text>{new Date(position.depositTimestamp.muln(1e3).toNumber()).toDateString()}</Text>
          ) : (
            <Skeleton h="20px" w="100px" />
          )}
        </StyledDataRow>
        <StyledDataRow>
          <StyledDataKey>Drip Frequency</StyledDataKey>
          {protoConfig ? (
            <Text>{displayGranularity(protoConfig.granularity.toNumber())}</Text>
          ) : (
            <Skeleton h="20px" w="100px" />
          )}
        </StyledDataRow>
        <StyledDataRow>
          <StyledDataKey>End Date</StyledDataKey>
          {estimatedEndDate ? (
            <Text>{estimatedEndDate.toDateString()}</Text>
          ) : (
            <Skeleton h="20px" w="100px" />
          )}
        </StyledDataRow>
      </StyledBodyContainer>
      <StyledFooterContainer>
        <Progress
          colorScheme="gray"
          isAnimated
          isIndeterminate={!dripProgress}
          borderRadius="50px"
          size="sm"
          w="100%"
          value={dripProgress?.toNumber()}
        />
        {dripProgress ? (
          <StyledFooterRow>{dripProgress.toNumber()}% dripped</StyledFooterRow>
        ) : (
          <StyledFooterRow>
            <Skeleton mt="5px" w="33%" h="12px" />
          </StyledFooterRow>
        )}
      </StyledFooterContainer>
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

const StyledBodyContainer = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

const StyledDataRow = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

const StyledDataKey = styled(Text)`
  font-weight: bold;
  color: #62aaff;
`;

const StyledFooterContainer = styled(Box)`
  margin-top: 30px;
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledFooterRow = styled(Box)`
  margin-top: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items;
  width: 100%;
  font-weight: 600;
  font-size: 12px;
`;

const StyledTokenAAmount = styled(Text)``;

const StyledTokenBAmount = styled(Text)`
  opacity: 0.5;
`;
