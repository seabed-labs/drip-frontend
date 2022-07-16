import { Button, ButtonProps, Spinner } from '@chakra-ui/react';
import { BroadcastTransactionWithMetadata } from '@dcaf-labs/drip-sdk/dist/types';
import { useState } from 'react';
import { useTxToast } from '../hooks/TxToast';

interface TransactionButtonProps {
  text: string;
  disabled?: boolean;
  sendTx: () => Promise<BroadcastTransactionWithMetadata<unknown>>;
}

export function TransactionButton({
  disabled,
  text,
  sendTx,
  ...buttonProps
}: TransactionButtonProps & ButtonProps) {
  const [loading, setLoading] = useState(false);
  const txToast = useTxToast();

  async function handleTx() {
    try {
      setLoading(true);
      const txInfo = await sendTx();
      txToast.success(txInfo);
    } catch (err) {
      console.error(`Error during ${text}: ${err}`);
      txToast.failure(err as Error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      display="flex"
      flexDir="row"
      variant="unstyled"
      bgColor="#62aaff"
      _hover={{
        bgColor: '#60a0ff',
        transition: '0.2s ease'
      }}
      color="white"
      onClick={handleTx}
      h="50px"
      borderRadius="50px"
      w="100%"
      disabled={disabled || loading}
      transition="0.2s ease"
      {...buttonProps}
    >
      {loading ? <Spinner /> : text}
    </Button>
  );
}
