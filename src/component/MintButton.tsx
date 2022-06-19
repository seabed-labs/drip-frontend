import { InfoIcon } from '@chakra-ui/icons';
import { ButtonProps, IconButton, Spinner, Tooltip } from '@chakra-ui/react';
import { useState } from 'react';
import { useTxToast } from '../hooks/TxToast';

interface MintButtonProps {
  mint: string;
  tokenName: string;
  wallet: string;
  amount: string;
}

export function MintButton({
  mint,
  tokenName,
  wallet,
  amount = '500',
  disabled,
  ...buttonProps
}: MintButtonProps & ButtonProps) {
  const [loading, setLoading] = useState(false);
  const txToast = useTxToast();

  async function handleMint() {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        mint: mint,
        wallet: wallet,
        amount: amount
      })
    };
    try {
      setLoading(true);
      fetch('https://devnet.api.drip.dcaf.so/mint', requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log('error', error));
      //   const response = JSON.parse(
      //     await (await fetch('https://devnet.api.drip.dcaf.so/mint', requestOptions)).text()
      //   );
      //   txToast.success({
      //     id: '',
      //     solscan: response?.txHash,
      //     metadata: undefined
      //   });
    } catch (err) {
      console.error(`Error during deposit: ${err}`);
      txToast.failure(err as Error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Tooltip label={`Mint 500 ${tokenName}`}>
      <IconButton
        disabled={disabled || loading}
        {...buttonProps}
        aria-label="Mint Tokens"
        icon={loading ? <Spinner /> : <InfoIcon />}
        onClick={handleMint}
      />
    </Tooltip>
  );
}
