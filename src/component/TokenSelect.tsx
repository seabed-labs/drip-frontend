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
  Button,
  Input,
  VStack,
  Box,
  BoxProps,
  Code
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
import { useNetworkAddress } from '../hooks/CurrentNetworkAddress';
import { useTokenInfo } from '../hooks/TokenInfo';
import { NetworkAddress } from '../models/NetworkAddress';
import { solscanTokenUrl } from '../utils/block-explorer';
import { displayPubkey, toPubkey } from '../utils/pubkey';

export interface TokenSelectorProps {
  onSelectToken(token: PublicKey): unknown;
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
  const [filter, setFilter] = useState<string>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  function onFilterChange(newFilter: string) {
    if (newFilter.trim() === '') {
      setFilter(undefined);
      return;
    }

    setFilter(newFilter);
  }

  const filteredTokens = useMemo(() => {
    if (!tokens) return [];
    if (!filter) return tokens;

    return tokens.filter(
      (token) =>
        token.symbol.toLowerCase().includes(filter.toLowerCase()) ||
        token.mint.toBase58().includes(filter)
    );
  }, [tokens, filter]);

  return (
    <>
      <HStack
        cursor="pointer"
        borderRadius="50px"
        bgColor="whiteAlpha.100"
        justifyContent="space-around"
        padding="10px"
        transition="0.3s ease"
        onClick={onOpen}
        _hover={{
          bgColor: 'whiteAlpha.200',
          transition: '0.3s ease'
        }}
      >
        {selectedTokenInfo && (
          <Image borderRadius="60px" w="30px" src={selectedTokenInfo?.logoURI} />
        )}
        {selectedTokenInfo ? (
          <Text fontSize="20px">{selectedTokenInfo.symbol}</Text>
        ) : (
          <Text paddingX="4px" fontSize="20px">
            Select Token
          </Text>
        )}
      </HStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bgColor="#101010">
          <ModalHeader>{modalTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              border="none"
              bgColor="whiteAlpha.100"
              placeholder="Enter token mint or symbol to filter"
              onChange={(e) => {
                onFilterChange(e.target.value);
              }}
            />
            <VStack mt="30px" overflowY="scroll" maxH="400px" w="100%">
              {filteredTokens?.map((token) => (
                <TokenRow
                  onClick={() => {
                    onSelectToken(toPubkey(token.mint));
                    onClose();
                  }}
                  paddingY="10px"
                  paddingX="20px"
                  token={token}
                />
              )) ?? null}
            </VStack>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

interface TokenRowProps {
  token: Token;
}

function TokenRow({ token, ...boxProps }: TokenRowProps & BoxProps) {
  const tokenNetworkAddr = useNetworkAddress(token.mint);
  const tokenInfo = useTokenInfo(tokenNetworkAddr);

  return (
    <HStack
      {...boxProps}
      cursor="pointer"
      _hover={{
        bgColor: 'whiteAlpha.100'
      }}
      w="100%"
      justifyContent="space-between"
    >
      <HStack>
        <Image borderRadius="30px" w="30px" src={tokenInfo?.logoURI} />
        <Text>{token.symbol}</Text>
      </HStack>
      <Code
        cursor="pointer"
        _hover={{
          textDecoration: 'underline'
        }}
        onClick={() => {
          window.open(solscanTokenUrl(tokenNetworkAddr), '_blank');
        }}
      >
        {displayPubkey(token.mint)}
      </Code>
    </HStack>
  );
}
