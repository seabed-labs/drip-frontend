import { Button, ButtonProps, Spinner } from '@chakra-ui/react';
import { BroadcastTransactionWithMetadata } from '@dcaf-protocol/drip-sdk/dist/types';
import { useState } from 'react';
import { useTxToast } from '../hooks/TxToast';

interface DepositButtonProps {
  text?: string;
  disabled?: boolean;
  deposit: () => Promise<BroadcastTransactionWithMetadata<unknown>>;
}

export function DepositButton({
  disabled,
  text,
  deposit,
  ...buttonProps
}: DepositButtonProps & ButtonProps) {
  const [loading, setLoading] = useState(false);
  const txToast = useTxToast();

  async function handleDeposit() {
    try {
      setLoading(true);
      const txInfo = await deposit();
      txToast.success(txInfo);
    } catch (err) {
      console.error(`Error during deposit: ${err}`);
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
      onClick={handleDeposit}
      h="50px"
      borderRadius="50px"
      w="100%"
      disabled={disabled || loading}
      transition="0.2s ease"
      {...buttonProps}
    >
      {loading ? <Spinner /> : text ?? 'Deposit'}
    </Button>
  );
}
