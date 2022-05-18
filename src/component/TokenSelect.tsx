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
  const [filter, setFilter] = useState<string>();

  function handleOnChange(token: Address | undefined) {
    onSelectToken(token !== undefined ? toPubkey(token) : token);
  }

  const tokenSymbolMap = useMemo(
    () =>
      tokens?.reduce(
        (acc, token) => ({ ...acc, [token.symbol]: token.mint.toBase58() }),
        {} as Partial<Record<string, string>>
      ) ?? {},
    [tokens]
  );
  const tokensMap = useMemo(
    () =>
      tokens?.reduce(
        (acc, token) => ({ ...acc, [token.mint.toBase58()]: token }),
        {} as Partial<Record<string, Token>>
      ) ?? {},
    [tokens]
  );
  const network = useNetwork();
  const selectedTokenInfo = useTokenInfo(
    selectedToken && NetworkAddress.from(network, selectedToken)
  );

  return (
    <FormControl>
      <AutoComplete
        filter={(query: string, optionValue: string) => {
          if (!tokensMap) return false;
          const token = tokensMap[optionValue];
          if (!token) return false;
          return token.symbol.trim().toLowerCase().includes(query.trim().toLowerCase());
        }}
        value={selectedToken}
        openOnFocus
        onChange={handleOnChange}
      >
        <AutoCompleteInput
          value={selectedTokenInfo?.symbol ?? filter}
          placeholder="Token A"
          variant="filled"
          onChange={(e) => {
            const tokenMint = tokenSymbolMap[e.target.value];
            if (tokenSymbolMap && tokenMint) {
              onSelectToken(toPubkey(tokenMint));
              setFilter(undefined);
            } else {
              onSelectToken(undefined);
              setFilter(filter && filter.trim() !== '' ? filter : undefined);
            }
          }}
        />
        <AutoCompleteList>
          {tokens ? (
            tokens.map((token) => (
              <AutoCompleteItem key={token.mint.toBase58()} value={token.mint.toBase58()}>
                <TokenOption token={token.mint} />
              </AutoCompleteItem>
            ))
          ) : (
            <Spinner />
          )}
        </AutoCompleteList>
      </AutoComplete>
    </FormControl>
  );
}

interface TokenOptionProps {
  token: PublicKey;
}

function TokenOption({ token }: TokenOptionProps) {
  const network = useNetwork();
  const tokenInfo = useTokenInfo(NetworkAddress.from(network, token));

  return (
    <HStack>
      <Image borderRadius="30px" w="30px" src={tokenInfo?.logoURI} />
      <Text>{tokenInfo?.symbol}</Text>
    </HStack>
  );
}
