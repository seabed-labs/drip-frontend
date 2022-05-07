import { Select } from '@chakra-ui/react';
import { Address } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { toPubkey } from '../utils/pubkey';

export interface TokenSelectorProps {
  onSelectToken(token: PublicKey): unknown;
  selectedToken: PublicKey;
  tokens: PublicKey[];
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
      value={selectedToken.toBase58()}
    >
      {tokens.map((token) => (
        <TokenOption token={token} />
      ))}
    </Select>
  );
}

interface TokenOptionProps {
  token: PublicKey;
}

function TokenOption({ token }: TokenOptionProps) {
  return <option value={token.toBase58()}>{token.toBase58()}</option>;
}
