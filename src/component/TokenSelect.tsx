import { Text, HStack, Image, Select, Spinner, MenuItemOption } from '@chakra-ui/react';
import { Address } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { useNetwork } from '../contexts/NetworkContext';
import { useTokenInfo } from '../hooks/TokenInfo';
import { NetworkAddress } from '../models/NetworkAddress';
import { toPubkey } from '../utils/pubkey';

export interface TokenSelectorProps {
  onSelectToken(token: PublicKey): unknown;
  selectedToken?: PublicKey;
  tokens?: PublicKey[];
  placeholder?: string;
}

export function TokenSelector({
  onSelectToken,
  selectedToken,
  tokens,
  placeholder = 'Select a token'
}: TokenSelectorProps) {
  function handleOnChange(token: Address) {
    onSelectToken(toPubkey(token));
  }

  return (
    <Select
      placeholder={placeholder}
      onChange={(e) => handleOnChange(e.target.selectedOptions[0].value)}
      value={selectedToken?.toBase58()}
    >
      {tokens ? (
        tokens.map((token) => <TokenOption key={token.toBase58()} token={token} />)
      ) : (
        <Spinner />
      )}
    </Select>
  );
}

interface TokenOptionProps {
  token: PublicKey;
}

function TokenOption({ token }: TokenOptionProps) {
  const network = useNetwork();
  const tokenInfo = useTokenInfo(NetworkAddress.from(network, token));

  return <option value={token.toBase58()}>{tokenInfo?.symbol}</option>;
}
