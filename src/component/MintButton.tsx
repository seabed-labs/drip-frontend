import { InfoIcon } from '@chakra-ui/icons';
import { ButtonProps, IconButton, Spinner, Tooltip } from '@chakra-ui/react';
import { useState } from 'react';
import { useRefreshContext } from '../contexts/Refresh';
import { useTxToast } from '../hooks/TxToast';
import { delay } from '../utils/time';

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
  const refreshContext = useRefreshContext();

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
      const response = await fetch('https://devnet.api.drip.dcaf.so/mint', requestOptions);
      const responseJSON = JSON.parse(await response.text());
      if (responseJSON.txHash) {
        await delay(1500);
        txToast.success({
          id: '',
          explorer: `https://explorer.solana.com/tx/${responseJSON?.txHash}?cluster=devnet`,
          metadata: undefined
        });
      } else {
        throw new Error(responseJSON);
      }
    } catch (err) {
      console.error(`Error during mint: ${err}`);
      txToast.failure(err as Error);
    } finally {
      setLoading(false);
    }
    refreshContext.forceRefresh();
  }

  // We can't mint orca USDC or wsol
  const unsupported =
    mint == 'EmXq3Ni9gfudTiyNKzzYvpnQqnJEMRw2ttnVXoJXjLo1' ||
    mint === 'So11111111111111111111111111111111111111112';

  return unsupported ? (
    <></>
  ) : (
    <Tooltip label={`Mint ${amount} ${tokenName}`}>
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
