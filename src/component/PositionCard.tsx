import { ArrowRightIcon } from '@chakra-ui/icons';
import { Text, Box, HStack, Image, Skeleton, Progress, useDisclosure } from '@chakra-ui/react';
import { findVaultPeriodPubkey } from '@dcaf-labs/drip-sdk';
import { useMemo } from 'react';
import styled from 'styled-components';
import { useAsyncMemo } from 'use-async-memo';
import { useDripContext } from '../contexts/DripContext';
import { useNetworkAddress } from '../hooks/CurrentNetworkAddress';
import { usePositionEndDate } from '../hooks/DripEndDate';
import { useDripProgress } from '../hooks/DripProgress';
import { VaultPositionAccountWithPubkey } from '../hooks/Positions';
import { useTokenInfo } from '../hooks/TokenInfo';
import { formatDate } from '../utils/date';
import { explainGranularity } from '../utils/granularity';
import { formatTokenAmount } from '../utils/token-amount';
import { Device } from '../utils/ui/css';
// import { AverageDripPrice } from './AveragePrice';
import { PositionModal } from './PositionModal';

export function PositionCard({ position }: PositionCardProps) {
  const drip = useDripContext();

  // const [isPriceFlipped, setIsPriceFlipped] = useState(false);

  const [vault] =
    useAsyncMemo(async () => drip?.querier.fetchVaultAccounts(position.vault), [drip, position]) ??
    [];

  const [protoConfig] =
    useAsyncMemo(
      async () => vault && drip?.querier.fetchVaultProtoConfigAccounts(vault.protoConfig),
      [drip, vault]
    ) ?? [];

  const [lastPositionPeriod] =
    useAsyncMemo(
      async () =>
        vault &&
        drip?.querier.fetchVaultPeriodAccounts(
          findVaultPeriodPubkey(drip.programId, {
            vault: position.vault,
            periodId: position.dripPeriodIdBeforeDeposit.add(position.numberOfSwaps)
          })
        ),
      [drip, vault, position]
    ) ?? [];

  const tokenAAddr = useNetworkAddress(vault?.tokenAMint);
  const tokenBAddr = useNetworkAddress(vault?.tokenBMint);
  const tokenAInfo = useTokenInfo(tokenAAddr);
  const tokenBInfo = useTokenInfo(tokenBAddr);
  const dripProgress = useDripProgress(vault, position);

  const endDate = usePositionEndDate(protoConfig, vault, position, lastPositionPeriod);
  const isDoneDripping = !!(
    vault?.lastDripPeriod &&
    lastPositionPeriod?.periodId &&
    vault.lastDripPeriod >= lastPositionPeriod?.periodId
  );

  const estimatedNextDripDate = useMemo(() => {
    if (!vault) return undefined;
    const vaultDripActivationDate = new Date(vault.dripActivationTimestamp.toNumber() * 1e3);
    if (vaultDripActivationDate < new Date()) {
      return new Date();
    }
    return vaultDripActivationDate;
  }, [vault]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <StyledContainer onClick={onOpen}>
        <StyledHeaderContainer>
          <HStack>
            {tokenAInfo ? (
              <>
                <StyledTokenIcon
                  fallback={<Skeleton borderRadius="50px" w="32px" h="32px" />}
                  src={tokenAInfo.iconUrl}
                />
                <Text>{tokenAInfo.symbol}</Text>
              </>
            ) : (
              <Skeleton h="40px" w="120px" />
            )}
          </HStack>
          <ArrowRightIcon w="12px" />
          <HStack>
            {tokenBInfo ? (
              <>
                <StyledTokenIcon
                  src={tokenBInfo.iconUrl}
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
                {formatTokenAmount(position.depositedTokenAAmount, tokenAInfo.decimals, true)}{' '}
                {tokenAInfo.symbol}
              </Text>
            ) : (
              <Skeleton h="20px" w="100px" />
            )}
          </StyledDataRow>
          <StyledDataRow>
            <StyledDataKey>Start</StyledDataKey>
            {tokenAInfo ? (
              <Text>{formatDate(new Date(position.depositTimestamp.muln(1e3).toNumber()))}</Text>
            ) : (
              <Skeleton h="20px" w="100px" />
            )}
          </StyledDataRow>
          <StyledDataRow>
            <StyledDataKey>Frequency</StyledDataKey>
            {protoConfig ? (
              <Text>{explainGranularity(protoConfig.granularity.toNumber())}</Text>
            ) : (
              <Skeleton h="20px" w="100px" />
            )}
          </StyledDataRow>
          <StyledDataRow>
            <StyledDataKey>End</StyledDataKey>
            {endDate ? (
              <Text>{endDate ? formatDate(endDate) : '-'}</Text>
            ) : (
              <Skeleton h="20px" w="100px" />
            )}
          </StyledDataRow>
          <StyledDataRow>
            <StyledDataKey>Next Drip</StyledDataKey>
            {estimatedNextDripDate ? (
              <Text>{!isDoneDripping ? formatDate(estimatedNextDripDate) : '-'}</Text>
            ) : (
              <Skeleton h="20px" w="100px" />
            )}
          </StyledDataRow>
          {/* <StyledDataRow>
            <StyledDataRowLeft>
              <StyledDataKey>Avg. Price</StyledDataKey>
              <RepeatIcon
                // onClick={(e) => {
                //   e.stopPropagation();
                //   setIsPriceFlipped((isFlipped) => !isFlipped);
                // }}
                _hover={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  transition: '0.2s ease'
                }}
                transition="0.2s ease"
                cursor="pointer"
                color="rgba(255, 255, 255, 0.6)"
                ml="6px"
                w="12px"
              />
            </StyledDataRowLeft>
            <StyledDataRowRight>
              <AverageDripPrice
                isPriceFlipped={isPriceFlipped}
                position={position}
                tokenAInfo={tokenAInfo}
                tokenBInfo={tokenBInfo}
              />
            </StyledDataRowRight>
          </StyledDataRow> */}
        </StyledBodyContainer>
        <StyledFooterContainer>
          <Progress
            colorScheme="gray"
            isAnimated
            isIndeterminate={!dripProgress}
            borderRadius="50px"
            size="sm"
            w="100%"
            value={dripProgress?.percentage.toNumber()}
          />
          {dripProgress ? (
            <StyledFooterRow>
              {`${dripProgress.percentage.toNumber()}% dripped (${dripProgress.completedDrips}/${
                dripProgress.totalDrips
              })`}
            </StyledFooterRow>
          ) : (
            <StyledFooterRow>
              <Skeleton mt="5px" w="33%" h="12px" />
            </StyledFooterRow>
          )}
        </StyledFooterContainer>
      </StyledContainer>
      {isOpen && (
        <PositionModal
          tokenAInfo={tokenAInfo}
          tokenBInfo={tokenBInfo}
          vault={vault ?? undefined}
          vaultProtoConfig={protoConfig ?? undefined}
          estimatedEndDate={endDate}
          position={position}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </>
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
  width: 290px;
  background: #101010;
  border-radius: 30px;
  box-shadow: 0 0 30px 1px rgba(49, 85, 128, 0.15);
  transition: 0.3s ease;

  @media ${Device.MobileL} {
    width: 367px;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 0 40px 3px rgba(49, 85, 128, 0.18);
    transition: 0.3s ease;
  }
`;

const StyledHeaderContainer = styled(Box)`
  width: 100%;
  font-size: 24px;
  @media ${Device.MobileL} {
    font-size: 32px;
  }
  font-weight: bold;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const StyledTokenIcon = styled(Image)`
  width: 28px;
  @media ${Device.MobileL} {
    width: 32px;
  }
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

// const StyledDataRowLeft = styled(Box)`
//   display: flex;
//   flex-direction: row;
//   justify-content: flex-start;
//   align-items: center;
//   margin-top: 10px;
// `;

// const StyledDataRowRight = styled(Box)`
//   display: flex;
//   flex-direction: row;
//   justify-content: flex-end;
//   align-items: baseline;
//   margin-top: 10px;
// `;

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
