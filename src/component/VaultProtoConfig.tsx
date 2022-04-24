import { Box, Button, Center, Code, Link, Select, useToast } from '@chakra-ui/react';
import { ChangeEvent, ChangeEventHandler, FC, useState } from 'react';
import { useNetwork } from '../contexts/NetworkContext';
import { useVaultClient } from '../hooks/VaultClient';
import { solscanTxUrl } from '../utils/block-explorer';
import { DcaGranularity } from '../vault-client/types';

function renderGranularity(granularity: DcaGranularity): string {
  switch (granularity) {
    case DcaGranularity.EveryFiveSeconds:
      return 'Every 5 seconds';
    case DcaGranularity.Hourly:
      return 'Hourly';
    case DcaGranularity.Daily:
      return 'Daily';
    case DcaGranularity.Weekly:
      return 'Weekly';
    case DcaGranularity.Monthly:
      return 'Monthly';
    default:
      return 'Unknown';
  }
}

const GRANULARITIES = [
  DcaGranularity.EveryFiveSeconds,
  DcaGranularity.Hourly,
  DcaGranularity.Daily,
  DcaGranularity.Weekly,
  DcaGranularity.Monthly
];

export const VaultProtoConfig: FC = () => {
  const [granularity, setGranularity] = useState<DcaGranularity>(DcaGranularity.EveryFiveSeconds);
  const toast = useToast();
  const network = useNetwork();
  const vaultClient = useVaultClient(network);

  function handleSelectOnChange(e: ChangeEvent<HTMLSelectElement>) {
    setGranularity(Number(e.target.value));
  }

  async function handleInitVaultProtoConfig() {
    const result = await vaultClient.initVaultProtoConfig(granularity);
    toast({
      title: 'Vault Proto Config created',
      description: (
        <>
          <Box>
            <Code colorScheme="black">{result.publicKey.toBase58()}</Code>
          </Box>
          <Box>
            <Link href={solscanTxUrl(result.txHash, network)} isExternal>
              Solscan
            </Link>
          </Box>
        </>
      ),
      status: 'success',
      duration: 9000,
      isClosable: true,
      position: 'top-right'
    });
  }

  return (
    <Center>
      <Box w="100%">
        <Box>
          <Select
            value={granularity}
            placeholder="Select granularity"
            onChange={handleSelectOnChange}
          >
            {GRANULARITIES.map((granularity) => (
              <option key={granularity} value={granularity}>
                {renderGranularity(granularity)}
              </option>
            ))}
          </Select>
        </Box>
        <Box mt="10px">
          <Button w="100%" onClick={handleInitVaultProtoConfig}>
            Deploy VaultProtoConfig
          </Button>
        </Box>
      </Box>
    </Center>
  );
};
