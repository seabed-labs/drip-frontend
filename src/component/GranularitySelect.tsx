import { Select } from '@chakra-ui/react';
import { Granularity } from '@dcaf-protocol/drip-sdk/dist/interfaces/drip-admin/params';
import { PublicKey } from '@solana/web3.js';
import { useAsyncMemo } from 'use-async-memo';
import { useDripContext } from '../contexts/DripContext';

interface GranularitySelectProps {
  tokenA?: PublicKey;
  tokenB?: PublicKey;
}

export function GranularitySelect({ tokenA, tokenB }: GranularitySelectProps) {
  const drip = useDripContext();
  const vaultProtoConfigsForPair = useAsyncMemo(async () => {
    if (!drip || !tokenA || !tokenB) return undefined;

    return await drip.querier.getSupportedVaultProtoConfigsForPair(tokenA, tokenB);
  }, [drip, tokenA, tokenB]);

  const isDisabled = !tokenA || !tokenB || !vaultProtoConfigsForPair;

  return (
    <Select
      cursor="pointer"
      h="50px"
      bgColor="whiteAlpha.100"
      maxW="295.08px"
      ml="20px"
      fontSize="18px"
      fontWeight="medium"
      minW="50px"
      // border="1px solid white"
      border="none"
      borderRadius="50px"
      placeholder="Choose velocity"
      defaultValue={undefined}
      disabled={isDisabled}
    >
      {vaultProtoConfigsForPair?.map((protoConfig) => (
        <option value={protoConfig.granularity}>
          {displayGranularity(protoConfig.granularity)}
        </option>
      ))}
    </Select>
  );
}

function displayGranularity(granularity: Granularity) {
  switch (granularity) {
    case Granularity.Minutely:
      return 'Minutely';
    case Granularity.Hourly:
      return 'Hourly';
    case Granularity.Daily:
      return 'Daily';
    case Granularity.Weekly:
      return 'Weekly';
    case Granularity.Monthly:
      return 'Monthly';
    case Granularity.Yearly:
      return 'Yearly';
  }
}
