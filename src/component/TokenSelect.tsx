import {
  FormControl,
  HStack,
  Text,
  Spinner,
  Image,
  useDisclosure,
  transition,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button
} from '@chakra-ui/react';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteList,
  AutoCompleteItem
} from '@choc-ui/chakra-autocomplete';
import { Token } from '@dcaf-protocol/drip-sdk';
import { Address } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { useMemo, useState } from 'react';
import { useNetwork } from '../contexts/NetworkContext';
import { useTokenInfo } from '../hooks/TokenInfo';
import { NetworkAddress } from '../models/NetworkAddress';
import { toPubkey } from '../utils/pubkey';

export interface TokenSelectorProps {
  onSelectToken(token: PublicKey | undefined): unknown;
  selectedToken?: PublicKey;
  tokens?: Token[];
  modalTitle?: string;
}

export function TokenSelector({
  onSelectToken,
  selectedToken,
  tokens,
  modalTitle = 'Select Token'
}: TokenSelectorProps) {
  const network = useNetwork();
  const selectedTokenInfo = useTokenInfo(
    selectedToken && NetworkAddress.from(network, selectedToken)
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <HStack
        cursor="pointer"
        borderRadius="30px"
        bgColor="whiteAlpha.100"
        padding="10px 20px"
        transition="0.3s ease"
        onClick={onOpen}
        spacing={!selectedTokenInfo ? '0' : 'auto'}
        _hover={{
          bgColor: 'whiteAlpha.200',
          transition: '0.3s ease'
        }}
      >
        <Image src={selectedTokenInfo?.logoURI} />
        <Text>{selectedTokenInfo?.symbol ?? 'Select Token'}</Text>
      </HStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bgColor="#101010">
          <ModalHeader>{modalTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
