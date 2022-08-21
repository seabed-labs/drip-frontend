/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArrowRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Image,
  Skeleton,
  Text,
  HStack,
  ModalBody,
  ModalFooter
} from '@chakra-ui/react';
import { QuoteToken } from '@dcaf-labs/drip-sdk';
import {
  VaultAccount,
  VaultProtoConfigAccount
} from '@dcaf-labs/drip-sdk/dist/interfaces/drip-querier/results';
import { TokenInfo } from '@solana/spl-token-registry';
import { BN } from 'bn.js';
import { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useAsyncMemo } from 'use-async-memo';
import { useDripContext } from '../contexts/DripContext';
import { useRefreshContext } from '../contexts/Refresh';
import { VaultPositionAccountWithPubkey } from '../hooks/Positions';
import { formatDate } from '../utils/date';
import { formatTokenAmount } from '../utils/token-amount';
import { Device } from '../utils/ui/css';
import { displayGranularity } from './GranularitySelect';
import { TransactionButton } from './TransactionButton';

interface PositionModalProps {
  position: VaultPositionAccountWithPubkey;
  vault?: VaultAccount;
  vaultProtoConfig?: VaultProtoConfigAccount;
  tokenAInfo?: TokenInfo;
  tokenBInfo?: TokenInfo;
  estimatedEndDate?: Date | '-';
  isOpen: boolean;
  onClose(): void;
}

export function PositionModal({
  position,
  vault,
  vaultProtoConfig,
  tokenAInfo,
  tokenBInfo,
  estimatedEndDate,
  isOpen,
  onClose
}: PositionModalProps) {
  const drip = useDripContext();
  const refreshContext = useRefreshContext();

  const dripPosition = useAsyncMemo(
    async () => drip?.getPosition(position.pubkey),
    [drip, position]
  );

  const [closePositionPreviewLoading, setClosePositionPreviewLoading] = useState(false);

  const closePositionPreview = useAsyncMemo(async () => {
    setClosePositionPreviewLoading(true);
    const preview = await dripPosition?.getClosePositionPreview();
    setClosePositionPreviewLoading(false);
    return preview;
  }, [dripPosition]);

  const averagePrice = useAsyncMemo(
    () => drip?.querier.getAveragePrice(position.pubkey, QuoteToken.TokenA),
    [drip, position]
  );

  const numberOfDripsCompleted = useMemo(() => {
    if (!vault) {
      return undefined;
    }

    if (position.isClosed) {
      return new BN(0);
    }

    const i = position.dripPeriodIdBeforeDeposit;
    const j = BN.min(
      vault.lastDripPeriod,
      position.dripPeriodIdBeforeDeposit.add(position.numberOfSwaps)
    );

    return j.sub(i);
  }, [position, vault]);

  const withdrawnTokenBAmountAfterSpread = useMemo(() => {
    if (!position || !vaultProtoConfig) return undefined;

    return position.withdrawnTokenBAmount
      .muln(1e4 - vaultProtoConfig.tokenBWithdrawalSpread)
      .divn(1e4);
  }, [position, vaultProtoConfig]);

  const remainingTokenAToDrip = useMemo(() => {
    if (!vault) {
      return undefined;
    }

    if (position.isClosed) {
      return new BN(0);
    }

    const initialDeposit = position.depositedTokenAAmount;
    const i = position.dripPeriodIdBeforeDeposit;
    const j = BN.min(
      vault.lastDripPeriod,
      position.dripPeriodIdBeforeDeposit.add(position.numberOfSwaps)
    );
    const dripAmount = position.periodicDripAmount;
    const periodsDripped = j.sub(i);

    return initialDeposit.sub(dripAmount.mul(periodsDripped));
  }, [position, vault]);

  const withdrawTokenB = useCallback(async () => {
    if (!dripPosition) throw new Error('Drip position is undefined');
    const txInfo = await dripPosition.withdrawB();
    setClosePositionPreviewLoading(true);
    refreshContext.forceRefresh();
    return txInfo;
  }, [dripPosition, refreshContext.forceRefresh]);

  const postSubmit = () => {
    setClosePositionPreviewLoading(true);
    refreshContext.forceRefresh();
    onClose();
  };

  const closePosition = useCallback(async () => {
    if (!dripPosition) throw new Error('Drip position is undefined');
    return await dripPosition.closePosition();
  }, [dripPosition, refreshContext.forceRefresh]);

  const accruedTokenB = useMemo(
    () =>
      withdrawnTokenBAmountAfterSpread &&
      closePositionPreview &&
      !closePositionPreviewLoading &&
      withdrawnTokenBAmountAfterSpread.add(closePositionPreview.tokenBAmountBeingWithdrawn),
    [withdrawnTokenBAmountAfterSpread, closePositionPreview]
  );

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent padding="20px" borderRadius="20px" bgColor="#101010">
        <ModalHeader>
          <StyledHeaderContainer>
            <StyledDripHeader>
              {tokenAInfo ? (
                <HStack>
                  <StyledTokenIcon
                    fallback={<Skeleton borderRadius="50px" w="32px" h="32px" />}
                    src={tokenAInfo.logoURI}
                  />
                  <Text>{tokenAInfo.symbol}</Text>
                </HStack>
              ) : (
                <Skeleton h="40px" w="120px" />
              )}
              <ArrowRightIcon w="12px" />
              {tokenBInfo ? (
                <HStack>
                  <StyledTokenIcon
                    fallback={<Skeleton borderRadius="50px" w="32px" h="32px" />}
                    src={tokenBInfo.logoURI}
                  />
                  <Text>{tokenBInfo.symbol}</Text>
                </HStack>
              ) : (
                <Skeleton h="40px" w="120px" />
              )}
            </StyledDripHeader>
            {vaultProtoConfig ? (
              <Text
                border="2px solid #62AAFF"
                borderRadius="50px"
                padding="5px 10px"
                fontSize="12px"
                ml="5px"
              >
                {displayGranularity(vaultProtoConfig.granularity.toNumber())}
              </Text>
            ) : (
              <Skeleton h="40px" w="80px" />
            )}
          </StyledHeaderContainer>
        </ModalHeader>
        <ModalBody>
          <StyledModalGrid>
            <StyledModalCol h="300px">
              <StyledModalField>
                <StyledModalFieldHeader>Deposit</StyledModalFieldHeader>
                <StyledModalFieldValue>
                  {tokenAInfo ? (
                    `${formatTokenAmount(
                      position.depositedTokenAAmount,
                      tokenAInfo.decimals,
                      true
                    )} ${tokenAInfo?.symbol}`
                  ) : (
                    <Skeleton mt="7px" w="120px" h="20px" />
                  )}
                </StyledModalFieldValue>
              </StyledModalField>
              <StyledModalField>
                <StyledModalFieldHeader>Remaining {tokenAInfo?.symbol}</StyledModalFieldHeader>
                <StyledModalFieldValue>
                  {tokenAInfo && remainingTokenAToDrip ? (
                    `${formatTokenAmount(remainingTokenAToDrip, tokenAInfo.decimals, true)} ${
                      tokenAInfo.symbol
                    }`
                  ) : (
                    <Skeleton mt="7px" w="120px" h="20px" />
                  )}
                </StyledModalFieldValue>
              </StyledModalField>
              <StyledModalField>
                <StyledModalFieldHeader>End</StyledModalFieldHeader>
                <StyledModalFieldValue>
                  {estimatedEndDate ? (
                    estimatedEndDate !== '-' ? (
                      formatDate(estimatedEndDate)
                    ) : (
                      '-'
                    )
                  ) : (
                    <Skeleton mt="7px" w="170px" h="20px" />
                  )}
                </StyledModalFieldValue>
              </StyledModalField>
              <StyledModalField>
                <StyledModalFieldHeader>Avg. Price</StyledModalFieldHeader>
                <StyledModalFieldValue>
                  {averagePrice && tokenAInfo && tokenBInfo ? (
                    <Text>
                      <StyledPriceValue>{`${formatTokenAmount(
                        averagePrice,
                        0,
                        true
                      )}`}</StyledPriceValue>{' '}
                      <StyledPriceUnit>{`${tokenAInfo.symbol} per ${tokenBInfo.symbol}`}</StyledPriceUnit>
                    </Text>
                  ) : closePositionPreviewLoading || (accruedTokenB && accruedTokenB.eqn(0)) ? (
                    '-'
                  ) : (
                    <Skeleton mt="7px" w="170px" h="20px" />
                  )}
                </StyledModalFieldValue>
              </StyledModalField>
            </StyledModalCol>
            <StyledModalCol h="300px">
              <StyledModalField>
                <StyledModalFieldHeader>Start</StyledModalFieldHeader>
                <StyledModalFieldValue>
                  {formatDate(new Date(position.depositTimestamp.muln(1e3).toNumber()))}
                </StyledModalFieldValue>
              </StyledModalField>
              <StyledModalField>
                <StyledModalFieldHeader>Accrued {tokenBInfo?.symbol}</StyledModalFieldHeader>
                <StyledModalFieldValue>
                  {accruedTokenB && tokenBInfo ? (
                    `${formatTokenAmount(accruedTokenB, tokenBInfo.decimals, true)} ${
                      tokenBInfo.symbol
                    }`
                  ) : (
                    <Skeleton mt="7px" w="120px" h="20px" />
                  )}
                </StyledModalFieldValue>
              </StyledModalField>
              <StyledModalField>
                <StyledModalFieldHeader>Drips Completed</StyledModalFieldHeader>
                <StyledModalFieldValue>
                  {numberOfDripsCompleted ? (
                    `${numberOfDripsCompleted?.toString()} out of ${position.numberOfSwaps.toString()}`
                  ) : (
                    <Skeleton mt="7px" w="120px" h="20px" />
                  )}
                </StyledModalFieldValue>
              </StyledModalField>
              <StyledModalField>
                <StyledModalFieldHeader>Withdrawn {tokenBInfo?.symbol}</StyledModalFieldHeader>
                <StyledModalFieldValue>
                  {tokenBInfo && withdrawnTokenBAmountAfterSpread ? (
                    `${formatTokenAmount(
                      withdrawnTokenBAmountAfterSpread,
                      tokenBInfo.decimals,
                      true
                    )} ${tokenBInfo?.symbol}`
                  ) : (
                    <Skeleton mt="7px" w="120px" h="20px" />
                  )}
                </StyledModalFieldValue>
              </StyledModalField>
            </StyledModalCol>
          </StyledModalGrid>
        </ModalBody>
        <ModalFooter>
          <StyledModalGrid mt="20px">
            <StyledModalCol>
              <TransactionButton
                variant="unstyled"
                height="46px"
                color="white"
                bgColor="#62AAFF"
                transition="0.2s ease"
                _hover={{
                  bgColor: '#60a0ff',
                  transition: '0.2s ease'
                }}
                borderRadius="50px"
                w="100%"
                sendTx={closePosition}
                text="Close Position"
                onSucess={postSubmit}
                onError={postSubmit}
              />
            </StyledModalCol>
            <StyledModalCol>
              <TransactionButton
                variant="unstyled"
                border="2px solid #62AAFF"
                height="46px"
                color="#62AAFF"
                bgColor="transparent"
                transition="0.2s ease"
                _hover={{
                  color: '#60a0ff',
                  border: '2px solid #60a0ff',
                  transition: '0.2s ease'
                }}
                borderRadius="50px"
                w="100%"
                sendTx={withdrawTokenB}
                text={`Withdraw ${tokenBInfo?.symbol}`}
                onSucess={postSubmit}
                onError={postSubmit}
              />
            </StyledModalCol>
          </StyledModalGrid>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

const StyledHeaderContainer = styled(Box)`
  width: 100%;
  font-size: 20px;
  font-weight: bold;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: -24px;
  justify-content: space-between;

  @media ${Device.MobileL} {
    font-size: 30px;
  }
`;

const StyledTokenIcon = styled(Image)`
  width: 20px;
  border-radius: 50px;

  @media ${Device.MobileL} {
    width: 30px;
  }
`;

const StyledDripHeader = styled(Box)`
  width: 300px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StyledModalGrid = styled(Box)`
  width: 100%;
  margin-top: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StyledModalCol = styled(Box)`
  width: 45%;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: space-between;
`;

const StyledModalField = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
`;

const StyledModalFieldHeader = styled(Text)`
  font-weight: 600;
  font-size: 14px;
  color: #62aaff;

  @media ${Device.MobileL} {
    font-size: 18px;
  }
`;

const StyledModalFieldValue = styled(Text)`
  font-size: 14px;

  @media ${Device.MobileL} {
    font-size: 16px;
  }
`;

const StyledPriceValue = styled(Text)`
  display: inline-block;
`;
const StyledPriceUnit = styled(Text)`
  display: inline-block;
  font-size: 13px;
  opacity: 60%;
`;
