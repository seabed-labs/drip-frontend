import {
  Box,
  Button,
  Center,
  Code,
  Link,
  NumberInput,
  NumberInputField,
  Select,
  useToast
} from '@chakra-ui/react';
import BN from 'bn.js';
import { ChangeEvent, FC, useCallback, useState } from 'react';
import { useDripContext } from '../contexts/DripContext';
import { useNetwork } from '../contexts/NetworkContext';
import { useDrip } from '../hooks/Drip';
import { useTxToast } from '../hooks/TxToast';
import { solscanTxUrl } from '../utils/block-explorer';
import { DcaGranularity } from '../vault-client/types';

// function renderGranularity(granularity: DcaGranularity): string {
//   switch (granularity) {
//     case DcaGranularity.EveryFiveSeconds:
//       return 'Every 5 seconds';
//     case DcaGranularity.Hourly:
//       return 'Hourly';
//     case DcaGranularity.Daily:
//       return 'Daily';
//     case DcaGranularity.Weekly:
//       return 'Weekly';
//     case DcaGranularity.Monthly:
//       return 'Monthly';
//     default:
//       return 'Unknown';
//   }
// }

// const GRANULARITIES = [
//   DcaGranularity.EveryFiveSeconds,
//   DcaGranularity.Hourly,
//   DcaGranularity.Daily,
//   DcaGranularity.Weekly,
//   DcaGranularity.Monthly
// ];

export const VaultProtoConfig: FC = () => {
  const [granularity, setGranularity] = useState<BN | undefined>(undefined);
  const [triggerDcaSpread, setTriggerDcaSpread] = useState<number | undefined>(undefined);
  const [baseWithdrawalSpread, setBaseWithdrawalSpread] = useState<number | undefined>(undefined);
  const txToast = useTxToast();
  const drip = useDripContext();
  const network = useNetwork();
  /**
    //  * DCA granularity in seconds
    //  */
  //    granularity: Granularity | BN;
  //    /**
  //     * Trigger DCA spread in basis points
  //     */
  //    triggerDcaSpread: number;
  //    /**
  //     * Withdrawal spread in basis points
  //     */
  //    baseWithdrawalSpread: number;
  const deployVaultProtoConfig = useCallback(async () => {
    if (!drip) throw new Error('Drip SDK is undefined');
    console.log(granularity, triggerDcaSpread, baseWithdrawalSpread);
    if (!granularity || !triggerDcaSpread || !baseWithdrawalSpread) {
      throw new Error('undefined inputs');
    }
    try {
      const txInfo = await drip.admin.initVaultProtoConfig({
        granularity,
        triggerDcaSpread,
        baseWithdrawalSpread
      });
      txToast.success(txInfo);
    } catch (err) {
      txToast.failure(err as Error);
    }
  }, [granularity, triggerDcaSpread, baseWithdrawalSpread, drip, network]);

  function handleGranularityChange(amount: string) {
    console.log('new granularity', amount);
    setGranularity(new BN(amount));
  }

  function handleTriggerDCASpread(_: string, amount: number) {
    console.log('new triggerDCASpread', amount);
    setTriggerDcaSpread(amount ? amount : undefined);
  }

  function handleBaseWithdrawalSpread(_: string, amount: number) {
    console.log('new baseWithdrawalSpread', amount);
    setBaseWithdrawalSpread(amount ? amount : undefined);
  }

  // async function handleInitVaultProtoConfig() {

  //   const blah = await drip?.admin.
  //   const result = await vaultClient.initVaultProtoConfig(granularity);
  //   toast({
  //     title: 'Vault Proto Config created',
  //     description: (
  //       <>
  //         <Box>
  //           <Code colorScheme="black">{result.publicKey.toBase58()}</Code>
  //         </Box>
  //         <Box>
  //           <Link href={solscanTxUrl(result.txHash, network)} isExternal>
  //             Solscan
  //           </Link>
  //         </Box>
  //       </>
  //     ),
  //     status: 'success',
  //     duration: 9000,
  //     isClosable: true,
  //     position: 'top-right'
  //   });
  // }
  return (
    <Center>
      <Box w="100%">
        <Box>
          <NumberInput value={granularity?.toString()} onChange={handleGranularityChange}>
            <NumberInputField
              fontWeight="medium"
              fontSize="20px"
              type="number"
              bgColor="whiteAlpha.100"
              placeholder="Granularity"
              border="none"
              h="50px"
              borderRadius="50px"
            />
          </NumberInput>
          <NumberInput value={triggerDcaSpread?.toString()} onChange={handleTriggerDCASpread}>
            <NumberInputField
              fontWeight="medium"
              fontSize="20px"
              type="number"
              bgColor="whiteAlpha.100"
              placeholder="Trigger DCA Spread"
              border="none"
              h="50px"
              borderRadius="50px"
            />
          </NumberInput>

          <NumberInput
            value={baseWithdrawalSpread?.toString()}
            onChange={handleBaseWithdrawalSpread}
          >
            <NumberInputField
              fontWeight="medium"
              fontSize="20px"
              type="number"
              bgColor="whiteAlpha.100"
              placeholder="Withdrawal Spread"
              border="none"
              h="50px"
              borderRadius="50px"
            />
          </NumberInput>
        </Box>
        <Box mt="10px">
          <Button
            w="100%"
            onClick={deployVaultProtoConfig}
            disabled={!granularity || !triggerDcaSpread || !baseWithdrawalSpread}
          >
            Deploy VaultProtoConfig
          </Button>
        </Box>
      </Box>
    </Center>
  );
};
