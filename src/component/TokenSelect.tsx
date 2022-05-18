import { FormControl, HStack, Text, Spinner, Image } from '@chakra-ui/react';
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
  placeholder?: string;
}

export function TokenSelector({
  onSelectToken,
  selectedToken,
  tokens,
  placeholder = 'Select a token'
}: TokenSelectorProps) {
  const network = useNetwork();
  const selectedTokenInfo = useTokenInfo(
    selectedToken && NetworkAddress.from(network, selectedToken)
  );

  return (
    <HStack
      cursor="pointer"
      borderRadius="30px"
      bgColor="whiteAlpha.100"
      padding="10px 20px"
      spacing={!selectedTokenInfo ? '0' : 'auto'}
    >
      <Image src={selectedTokenInfo?.logoURI} />
      <Text>{selectedTokenInfo?.symbol ?? 'Select Token'}</Text>
    </HStack>
  );
}
