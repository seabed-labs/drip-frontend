import { Box, Link, useToast } from '@chakra-ui/react';
import { BroadcastTransactionWithMetadata } from '@dcaf-labs/drip-sdk/dist/types';
import { useMemo } from 'react';
import { Network } from '@dcaf-labs/drip-sdk';
import { useNetwork } from '../contexts/NetworkContext';

interface TxToast {
  success(txInfo: BroadcastTransactionWithMetadata<unknown>): void;
  failure(error: Error): void;
}

function getSolscanUrl(
  network: Network,
  txInfo: BroadcastTransactionWithMetadata<unknown>
): string {
  switch (network) {
    case Network.Mainnet:
      return `https://solscan.io/tx/${txInfo.id}`;
    case Network.Devnet:
      return `https://solscan.io/tx/${txInfo.id}?cluster=devnet`;
    case Network.Localnet:
      return ``;
  }
}

function getExplorerUrl(
  network: Network,
  txInfo: BroadcastTransactionWithMetadata<unknown>
): string {
  switch (network) {
    case Network.Mainnet:
      return `https://explorer.solana.com/tx/${txInfo.id}`;
    case Network.Devnet:
      return `https://explorer.solana.com/tx/${txInfo.id}?cluster=devnet`;
    case Network.Localnet:
      return ``;
  }
}

function mapErrorMesage(message: string): string {
  if (
    message.includes(
      'failed to send transaction: Transaction simulation failed: Attempt to debit an account but found no record of a prior credit'
    )
  ) {
    return 'Insufficient funds. (Note: SOL is needed to pay for tx fees)';
  }
  return message;
}
export function useTxToast(): TxToast {
  const toast = useToast();
  const network = useNetwork();
  return useMemo(
    () => ({
      success(txInfo: BroadcastTransactionWithMetadata<unknown>) {
        toast({
          title: 'Transaction successful',
          description: (
            <Box>
              <Link href={getExplorerUrl(network, txInfo)} isExternal textDecoration="overline">
                Solana Explorer
              </Link>
              <Link href={getSolscanUrl(network, txInfo)} isExternal textDecoration="underline">
                Solscan
              </Link>

              {/* <Link href={`${getExplorerUrl}`} isExternal textDecoration="overline">
                Solana Explorer
              </Link>
              <Link href={`${getSolscanUrl}`} isExternal textDecoration="underline">
                Solscan
              </Link> */}
            </Box>
          ),
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-right'
        });
      },
      failure(error: Error) {
        toast({
          title: 'Transaction (or simulation) failed',
          description: mapErrorMesage(error.message),
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top-right'
        });
      }
    }),
    [toast]
  );
}
