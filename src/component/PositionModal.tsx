/* eslint-disable @typescript-eslint/no-unused-vars */
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
  ModalFooter,
  Button
} from '@chakra-ui/react';
import {
  VaultAccount,
  VaultProtoConfigAccount
} from '@dcaf-labs/drip-sdk/dist/interfaces/drip-querier/results';
import { TokenInfo } from '@solana/spl-token-registry';
import { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useAsyncMemo } from 'use-async-memo';
import { useDripContext } from '../contexts/DripContext';
import { VaultPositionAccountWithPubkey } from '../hooks/Positions';
import { formatTokenAmount, formatTokenAmountStr } from '../utils/token-amount';
import { displayGranularity } from './GranularitySelect';

interface PositionModalProps {
  position: VaultPositionAccountWithPubkey;
  vault?: VaultAccount;
  vaultProtoConfig?: VaultProtoConfigAccount;
  tokenAInfo?: TokenInfo;
  tokenBInfo?: TokenInfo;
  estimatedEndDate?: Date;
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
  const dripPosition = useAsyncMemo(
    async () => drip?.getPosition(position.pubkey),
    [drip, position]
  );
  const closePositionPreview = useAsyncMemo(
    async () => dripPosition?.getClosePositionPreview(),
    [dripPosition]
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
              <Text>→</Text>
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
                fontSize="14px"
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
                <StyledModalFieldHeader>Initial Deposit</StyledModalFieldHeader>
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
                  {tokenAInfo && closePositionPreview ? (
                    `${formatTokenAmount(
                      closePositionPreview.tokenAAmountBeingWithdrawn,
                      tokenAInfo.decimals,
                      true
                    )} ${tokenAInfo?.symbol}`
                  ) : (
                    <Skeleton mt="7px" w="120px" h="20px" />
                  )}
                </StyledModalFieldValue>
              </StyledModalField>
              <StyledModalField>
                <StyledModalFieldHeader>Est. End Date</StyledModalFieldHeader>
                <StyledModalFieldValue>
                  {estimatedEndDate ? (
                    estimatedEndDate.toDateString()
                  ) : (
                    <Skeleton mt="7px" w="170px" h="20px" />
                  )}
                </StyledModalFieldValue>
              </StyledModalField>
              <StyledModalField>
                {/* TODO(matcha): Compute average drip price and render here */}
                <StyledModalFieldHeader>Avg. Drip Price</StyledModalFieldHeader>
                <StyledModalFieldValue>100 USDC per SOL</StyledModalFieldValue>
              </StyledModalField>
            </StyledModalCol>
            <StyledModalCol h="300px">
              <StyledModalField>
                <StyledModalFieldHeader>Open Date</StyledModalFieldHeader>
                <StyledModalFieldValue>
                  {new Date(position.depositTimestamp.muln(1e3).toNumber()).toDateString()}
                </StyledModalFieldValue>
              </StyledModalField>
              <StyledModalField>
                {/* TODO(matcha): Compute max B amount to withdraw and render here */}
                <StyledModalFieldHeader>Accrued SOL</StyledModalFieldHeader>
                <StyledModalFieldValue>2 SOL</StyledModalFieldValue>
              </StyledModalField>
              <StyledModalField>
                <StyledModalFieldHeader>Total Drips</StyledModalFieldHeader>
                <StyledModalFieldValue>{position.numberOfSwaps.toString()}</StyledModalFieldValue>
              </StyledModalField>
              <StyledModalField>
                <StyledModalFieldHeader>Withdrawn {tokenBInfo?.symbol}</StyledModalFieldHeader>
                <StyledModalFieldValue>
                  {tokenBInfo ? (
                    `${formatTokenAmount(
                      position.withdrawnTokenBAmount,
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
              <Button
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
              >
                Close Position
              </Button>
            </StyledModalCol>
            <StyledModalCol>
              <Button
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
              >
                Withdraw SOL
              </Button>
            </StyledModalCol>
          </StyledModalGrid>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

const StyledHeaderContainer = styled(Box)`
  width: 100%;
  font-size: 32px;
  font-weight: bold;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: -24px;
  justify-content: space-between;
`;

const StyledTokenIcon = styled(Image)`
  width: 32px;
  border-radius: 50px;
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
  font-size: 18px;
  color: #62aaff;
`;

const StyledModalFieldValue = styled(Text)`
  font-size: 18px;
`;
