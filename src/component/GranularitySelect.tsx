import { Select } from '@chakra-ui/react';
import { Granularity } from '@dcaf-labs/drip-sdk/dist/interfaces/drip-admin/params';
import { PublicKey } from '@solana/web3.js';
import { useAsyncMemo } from 'use-async-memo';
import { useDripContext } from '../contexts/DripContext';
import { Device } from '../utils/ui/css';
import styled from 'styled-components';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 140px;
  min-width: 140px;

  @media ${Device.Tablet} {
    max-width: 300px;
  }
`;

interface GranularitySelectProps {
  tokenA?: PublicKey;
  tokenB?: PublicKey;
  granularity?: Granularity;
  onUpdate(newGranularity?: Granularity): void;
}

export function GranularitySelect({ tokenA, tokenB, onUpdate }: GranularitySelectProps) {
  const drip = useDripContext();
  const vaultProtoConfigsForPair = useAsyncMemo(async () => {
    if (!drip || !tokenA || !tokenB) return undefined;

    return await drip.querier.getSupportedVaultProtoConfigsForPair(tokenA, tokenB);
  }, [drip, tokenA, tokenB]);

  const isDisabled = !tokenA || !tokenB || !vaultProtoConfigsForPair;

  return (
    <StyledContainer>
      <Select
        cursor="pointer"
        h="40px"
        bgColor="whiteAlpha.100"
        ml="20px"
        w="100%"
        fontSize="12px"
        fontWeight="medium"
        border="none"
        borderRadius="50px"
        placeholder="Frequency"
        defaultValue={undefined}
        sx={{
          [`@media ${Device.Tablet}`]: {
            height: '50px',
            fontSize: '18px'
          }
        }}
        onChange={(e) => {
          if (e.target.selectedIndex === 0) {
            // Selected placeholder
            onUpdate(undefined);
            return;
          }

          const selectedConfig = vaultProtoConfigsForPair?.[e.target.selectedIndex - 1]; // -1 since placeholder is also an index
          if (selectedConfig) {
            onUpdate(selectedConfig.granularity);
          }
        }}
        disabled={isDisabled}
      >
        {vaultProtoConfigsForPair?.map((protoConfig) => (
          <option key={protoConfig.pubkey.toBase58()} value={protoConfig.granularity}>
            {displayGranularity(protoConfig.granularity)}
          </option>
        ))}
      </Select>
    </StyledContainer>
  );
}

export function displayGranularity(granularity: Granularity) {
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
