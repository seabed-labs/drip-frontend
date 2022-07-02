import { Box, Link, useToast } from '@chakra-ui/react';
import { BroadcastTransactionWithMetadata } from '@dcaf-labs/drip-sdk/dist/types';
import { useMemo } from 'react';

interface TxToast {
  success(txInfo: BroadcastTransactionWithMetadata<unknown>): void;
  failure(error: Error): void;
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
              <Link href={txInfo.solscan} isExternal textDecoration="underline">
                Solscan
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
          description: error.message,
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
