import { Box, Link, useToast } from '@chakra-ui/react';
import { BroadcastTransactionWithMetadata } from '@dcaf-labs/drip-sdk/dist/types';
import { useMemo } from 'react';

interface TxToast {
  success(txInfo: BroadcastTransactionWithMetadata<unknown>): void;
  failure(error: Error): void;
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

  return useMemo(
    () => ({
      success(txInfo: BroadcastTransactionWithMetadata<unknown>) {
        toast({
          title: 'Transaction successful',
          description: (
            <Box>
              <Link href={txInfo.explorer} isExternal textDecoration="underline">
                Explorer
              </Link>
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
