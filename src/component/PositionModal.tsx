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
  ModalCloseButton
} from '@chakra-ui/react';
import {
  VaultAccount,
  VaultProtoConfigAccount
} from '@dcaf-protocol/drip-sdk/dist/interfaces/drip-querier/results';
import { TokenInfo } from '@solana/spl-token-registry';
import styled from 'styled-components';
import { VaultPositionAccountWithPubkey } from '../hooks/Positions';
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
  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent borderRadius="20px" bgColor="#101010">
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
              <Skeleton h="20px" w="100px" />
            )}
          </StyledHeaderContainer>
        </ModalHeader>
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
