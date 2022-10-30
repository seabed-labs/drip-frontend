import {
  HStack,
  Text,
  Image,
  useDisclosure,
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
  BoxProps,
  Code,
  Flex,
  Box,
  Divider,
  Wrap,
  WrapItem
} from '@chakra-ui/react';
import { SmallCloseIcon } from '@chakra-ui/icons';
import { isSol, Token } from '@dcaf-labs/drip-sdk';
import { PublicKey } from '@solana/web3.js';
import { useCallback, useMemo, useState } from 'react';
import { useNetwork } from '../contexts/NetworkContext';
import { useNetworkAddress } from '../hooks/CurrentNetworkAddress';
import { useTokenInfo } from '../hooks/TokenInfo';
import { NetworkAddress } from '../models/NetworkAddress';
import { solscanTokenUrl } from '../utils/block-explorer';
import { displayPubkey, toPubkey } from '../utils/pubkey';
import { Device } from '../utils/ui/css';
import { PrioritizedTokenOpts, usePrioritizedTokens } from '../hooks/PrioritizedTokens';
import { useTokenBalances } from '../hooks/TokenBalances';
import { useWallet } from '@solana/wallet-adapter-react';
import { formatTokenAmountStr } from '../utils/token-amount';
import { useSolBalance } from '../hooks/SolBalance';

export interface TokenSelectorProps {
  onSelectToken(token: PublicKey): unknown;
  onClearToken(): unknown;
  selectedToken?: PublicKey;
  placeholder?: string;
  tokens?: Token[];
  modalTitle?: string;
  disabled?: boolean;
}

export function TokenSelector({
  onSelectToken,
  onClearToken,
  selectedToken,
  tokens,
  placeholder = 'Select Token',
  modalTitle = 'Select Token',
  disabled = false
}: TokenSelectorProps) {
  const network = useNetwork();
  const selectedTokenInfo = useTokenInfo(
    selectedToken && NetworkAddress.from(network, selectedToken)
  );
  const [filter, setFilter] = useState<string>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const wallet = useWallet();
  const tokenBalances = useTokenBalances(wallet.publicKey?.toBase58());
  const solBalance = useSolBalance(wallet.publicKey?.toBase58());

  function onFilterChange(newFilter: string) {
    if (newFilter.trim() === '') {
      setFilter(undefined);
      return;
    }

    setFilter(newFilter);
  }

  const prioritizedTokenOpts: PrioritizedTokenOpts = useMemo(
    () => ({
      mints: tokens && tokens.map((token) => token.mint.toBase58()),
      filter
    }),
    [tokens, filter]
  );

  const prioritizedTokens = usePrioritizedTokens(prioritizedTokenOpts);

  const tokensToRender = useMemo(() => {
    if (!prioritizedTokens) return [];
    return prioritizedTokens.userTokens.concat(prioritizedTokens.otherTokens);
  }, [prioritizedTokens]);

  const onTokenSelect = useCallback(
    (token: Token) => {
      onSelectToken(toPubkey(token.mint));
      setFilter(undefined);
      onClose();
    },
    [onSelectToken]
  );

  return (
    <>
      <Button
        minW="auto"
        cursor="pointer"
        borderRadius="50px"
        bgColor="whiteAlpha.100"
        justifyContent="space-between"
        p="10px"
        h="40px"
        transition="0.3s ease"
        onClick={onOpen}
        disabled={disabled}
        _hover={{
          bgColor: 'whiteAlpha.200',
          transition: '0.3s ease',
          borderRadius: '50px'
        }}
        css={{
          [`@media ${Device.Tablet}`]: {
            height: '50px',
            padding: '14px'
          }
        }}
      >
        {selectedTokenInfo && (
          <Image
            mr="5px"
            borderRadius="60px"
            w="24px"
            css={{
              [`@media ${Device.Tablet}`]: {
                width: '28px',
                marginRight: '5px'
              }
            }}
            src={selectedTokenInfo.iconUrl}
          />
        )}
        {selectedTokenInfo ? (
          <Flex
            ml="2px"
            flex-direction="row"
            w="100%"
            justify-content="flex-start"
            alignItems="center"
          >
            <Text
              fontSize="12px"
              css={{
                [`@media ${Device.Tablet}`]: {
                  fontSize: '18px'
                }
              }}
            >
              {selectedTokenInfo.symbol}
            </Text>
            <Box
              opacity="0.5"
              ml="5px"
              onClick={(e) => {
                e.stopPropagation();
                onClearToken();
              }}
              p="1px"
              display="flex"
              flexDir="column"
              justifyContent="center"
              alignItems="center"
              transition="0.1s ease"
              _hover={{
                opacity: '1',
                transition: '0.1s ease'
              }}
            >
              <SmallCloseIcon />
            </Box>
          </Flex>
        ) : (
          <Text
            paddingX="2px"
            fontSize="12px"
            css={{
              [`@media ${Device.Tablet}`]: {
                paddingX: '4px',
                fontSize: '18px'
              }
            }}
          >
            {placeholder}
          </Text>
        )}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          borderRadius="20px"
          mt="3rem"
          css={{
            [`@media ${Device.Tablet}`]: {
              marginTop: '15rem'
            }
          }}
          bgColor="#101010"
        >
          <ModalHeader>{modalTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody maxH="490px">
            <Input
              border="none"
              bgColor="whiteAlpha.100"
              placeholder="Enter token mint or symbol to filter"
              onChange={(e) => {
                onFilterChange(e.target.value);
              }}
            />
            {prioritizedTokens && prioritizedTokens.bluechips.length > 0 && (
              <>
                <Wrap my="20px" spacing="10px">
                  {prioritizedTokens?.bluechips.map((token) => (
                    <WrapItem key={token.mint.toBase58()}>
                      <BluechipToken token={token} onClick={() => onTokenSelect(token)} />
                    </WrapItem>
                  ))}
                </Wrap>
                <Divider />
              </>
            )}
            <VStack mt="30px" maxH="260px" overflowY="scroll" w="100%">
              {tokensToRender?.map((token) => (
                <TokenRow
                  onClick={() => onTokenSelect(token)}
                  paddingY="10px"
                  paddingX="20px"
                  key={token.mint.toBase58()}
                  token={token}
                  balance={
                    isSol(token.mint.toBase58())
                      ? solBalance
                      : tokenBalances?.[token.mint.toBase58()]
                  }
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
  balance?: bigint;
}

function TokenRow({ token, balance, ...boxProps }: TokenRowProps & BoxProps) {
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
        <Image borderRadius="30px" w="30px" src={tokenInfo?.iconUrl} />
        <HStack alignItems="baseline">
          <Text>{token.symbol}</Text>
          {balance && (
            <Text fontSize="10px">
              {formatTokenAmountStr(balance.toString(), token.decimals, true)}
            </Text>
          )}
        </HStack>
      </HStack>
      <Code
        cursor="pointer"
        _hover={{
          textDecoration: 'underline'
        }}
        onClick={() => {
          if (!tokenNetworkAddr) return;
          window.open(solscanTokenUrl(tokenNetworkAddr), '_blank');
        }}
      >
        {displayPubkey(token.mint)}
      </Code>
    </HStack>
  );
}

interface BluechipTokenProps {
  token: Token;
  onClick: () => unknown;
}

function BluechipToken({ token, onClick }: BluechipTokenProps) {
  const tokenNetworkAddr = useNetworkAddress(token.mint);
  const tokenInfo = useTokenInfo(tokenNetworkAddr);

  return (
    <HStack
      border="1px solid"
      p="8px 10px"
      borderColor="whiteAlpha.300"
      borderRadius="80px"
      _hover={{
        cursor: 'pointer',
        bgColor: 'whiteAlpha.100'
      }}
      onClick={onClick}
    >
      <Image borderRadius="30px" w="20px" src={tokenInfo?.iconUrl} />
      <Text fontSize="12px">{token.symbol}</Text>
    </HStack>
  );
}
