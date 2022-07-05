import { Box, Button, Center, NumberInput, NumberInputField } from '@chakra-ui/react';
import BN from 'bn.js';
import { FC, useCallback, useState } from 'react';
import { useDripContext } from '../contexts/DripContext';
import { useNetwork } from '../contexts/NetworkContext';
import { useTxToast } from '../hooks/TxToast';

export const VaultProtoConfig: FC = () => {
  const [granularity, setGranularity] = useState<BN | undefined>(undefined);
  const [triggerDcaSpread, setTriggerDcaSpread] = useState<number | undefined>(undefined);
  const [baseWithdrawalSpread, setBaseWithdrawalSpread] = useState<number | undefined>(undefined);
  const txToast = useTxToast();
  const drip = useDripContext();
  const network = useNetwork();

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
