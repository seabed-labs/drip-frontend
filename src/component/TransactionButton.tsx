import { Button, ButtonProps, Spinner } from '@chakra-ui/react';
import { BroadcastTransactionWithMetadata } from '@dcaf-labs/drip-sdk/dist/types';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useState } from 'react';
import { useTxToast } from '../hooks/TxToast';
import { Device } from '../utils/ui/css';

interface TransactionButtonProps {
  text: string;
  disabled?: boolean;
  sendTx: () => Promise<BroadcastTransactionWithMetadata<unknown>>;
  onSucess: () => void;
  onError: () => void;
}

export function TransactionButton({
  disabled,
  text,
  sendTx,
  onSucess,
  onError,
  ...buttonProps
}: TransactionButtonProps & ButtonProps) {
  const [loading, setLoading] = useState(false);
  const txToast = useTxToast();
  const wallet = useAnchorWallet();
  const isWalletConnected = !!wallet;
  const walletModal = useWalletModal();

  async function handleTx() {
    try {
      setLoading(true);
      const txInfo = await sendTx();
      txToast.success(txInfo);
      onSucess();
    } catch (err) {
      console.error(`Error during ${text}: ${err}`);
      txToast.failure(err as Error);
      onError();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      display="flex"
      flexDir="row"
      variant="unstyled"
      bgColor={isWalletConnected ? '#62aaff' : '#512da8'}
      _hover={{
        bgColor: isWalletConnected ? '#60a0ff' : '#1a1f2e',
        transition: '0.2s ease'
      }}
      fontFamily={isWalletConnected ? undefined : 'DM Sans'}
      color="white"
      onClick={isWalletConnected ? handleTx : () => walletModal.setVisible(true)}
      h="50px"
      borderRadius="50px"
      w="100%"
      disabled={isWalletConnected ? disabled || loading : false}
      transition="0.2s ease"
      css={{
        fontSize: '12px',
        [`@media ${Device.Tablet}`]: {
          fontSize: '18px'
        }
      }}
      {...buttonProps}
    >
      {isWalletConnected ? loading ? <Spinner /> : text : 'Select Wallet'}
      {}
    </Button>
  );
}
