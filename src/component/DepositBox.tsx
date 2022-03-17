import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  VStack,
  Text,
  useToast,
  Box,
  Code,
  Link
} from '@chakra-ui/react';
import { useState } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import { useNetwork } from '../contexts/NetworkContext';
import { useTokenABalance, useVaultClient } from '../hooks/VaultClient';
import { BN } from '@project-serum/anchor';
import { solscanTxUrl } from '../utils/block-explorer';
import 'react-datepicker/dist/react-datepicker.css';

// TODO: Finalize the border-shadow on this
const Container = styled.div`
  padding: 20px;
  height: 600px;
  width: 500px;
  background: #101010;
  border-radius: 60px;
  box-shadow: 0 0 128px 1px rgba(98, 170, 255, 0.15);
`;

const DepositRow = styled.div`
  padding: 40px 40px 0px 40px;
`;

// TODO(Mocha): Refactor styles
// TODO(Mocha): The form should be its own component

enum Granularity {
  Minutely = 'Minutely',
  Hourly = 'Hourly',
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly'
}

function granularityToUnix(granularity: Granularity): number {
  switch (granularity) {
    case Granularity.Minutely:
      return 60;
    case Granularity.Hourly:
      return 60 * 60;
    case Granularity.Daily:
      return 60 * 60 * 24;
    case Granularity.Weekly:
      return 60 * 60 * 24 * 7;
    case Granularity.Monthly:
      return 50 * 60 * 24 * 30;
  }
}

function getNumSwaps(startTime: Date, endTime: Date, granularity: Granularity): number {
  return Math.floor(
    (endTime.getTime() - startTime.getTime()) / 1000 / granularityToUnix(granularity)
  );
}

function getPreviewText(endDateTime: Date, granularity: Granularity, tokenAAmount: number) {
  const swaps = getNumSwaps(new Date(), endDateTime, granularity);
  const dripAmount = Math.floor(tokenAAmount / swaps);
  return (
    <Text>
      <Text as="u">{swaps}</Text>
      {' swaps of '}
      <Text as="u">{dripAmount}</Text>
      {` ${'USDC'} `}
      <Text as="u">{granularity}</Text>
    </Text>
  );
}

export const DepositBox = () => {
  const [endDateTime, setEndDateTime] = useState<Date | undefined>();
  console.log('endDateTime:', Math.floor(endDateTime?.getTime() ?? 0 / 1000));
  const [tokenAAmount, setTokenAAmount] = useState<number>(0);
  console.log('tokenAAmount:', tokenAAmount);
  const [granularity, setGranularity] = useState(Granularity.Minutely);
  console.log('granularity:', granularity);

  // TODO(Mocha): this is base values rn, we need decimals
  const userTokenABlance = useTokenABalance('3btAv45JmtLu8W8ySwYqxyY1P27xcgFTc4jr3shLyfvE');
  const maxTokenALabel = userTokenABlance ? `max: ${userTokenABlance.toString()}` : `-`;

  const network = useNetwork();
  const vaultClient = useVaultClient(network);
  const toast = useToast();

  // const granulairtyOptions = ;
  async function handleDeposit(vault: string, baseAmount: BN, numberOfCycles: BN) {
    try {
      const result = await vaultClient.deposit(vault, baseAmount, numberOfCycles);

      toast({
        title: 'Deposit successful',
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
    } catch (err) {
      console.error(err);
      toast({
        title: 'Deposit failed',
        description: (err as Error).message,
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top-right'
      });
    }
  }

  return (
    <Container>
      <DepositRow>
        <HStack>
          <FormControl variant="floating">
            <FormLabel htmlFor="drip-select">Drip</FormLabel>
            <Select id="drip-select" bg="#262626">
              <option>USDC</option>
            </Select>
          </FormControl>
          <FormControl variant="floating">
            <FormLabel htmlFor="drip-amount-select">{maxTokenALabel}</FormLabel>
            <Input
              id="drip-amount-select"
              placeholder="0"
              bg="#262626"
              type={'number'}
              value={tokenAAmount === 0 ? undefined : tokenAAmount}
              onChange={(event) => setTokenAAmount(Number(event.target.value))}
            />
          </FormControl>
        </HStack>
      </DepositRow>

      {/* To */}
      <DepositRow>
        <HStack>
          <FormControl variant="floating">
            <FormLabel htmlFor="drip-to-select">To</FormLabel>
            <Select id="drip-to-select" bg="#262626">
              <option>BTC</option>
            </Select>
          </FormControl>
          <FormControl variant="floating">
            {/* TODO(Mocha): How do I remove this form label but still have the row bottom aligned */}
            <FormLabel htmlFor="granularity-select">Granularity</FormLabel>
            {/* Not updating to granularity value */}
            <Select
              id="granularity-select"
              bg="#262626"
              onChange={(option) => {
                setGranularity(option.target.selectedOptions[0].text as Granularity);
              }}
              value={granularity}
            >
              {Object.values(Granularity).map((granularity) => (
                <option>{granularity}</option>
              ))}
            </Select>
          </FormControl>
        </HStack>
      </DepositRow>
      {/* Till */}
      <DepositRow>
        <FormControl variant="floating">
          <FormLabel htmlFor="granularity-select">Till</FormLabel>
          <DatePicker
            id="granularity-select"
            selected={endDateTime}
            minDate={new Date()}
            onChange={(date: Date) => setEndDateTime(date)}
            showTimeSelect={
              granularity == Granularity.Minutely || granularity == Granularity.Hourly
            }
            timeIntervals={
              granularity == Granularity.Minutely
                ? 1
                : granularity == Granularity.Hourly
                ? 60
                : undefined
            }
          />
        </FormControl>
      </DepositRow>
      {/* Preview and Deposit */}
      <DepositRow>
        <VStack>
          {tokenAAmount && endDateTime && granularity
            ? getPreviewText(endDateTime, granularity, tokenAAmount)
            : undefined}
          <Button
            onClick={() => {
              const swaps = getNumSwaps(new Date(), endDateTime ?? new Date(), granularity);
              console.log('numSwaps', swaps);
              console.log('tokenAAmount', tokenAAmount);
              handleDeposit(
                '8NmRaD8gvZiomrzoXsuJRFU742WK6DBaW4Wanw1xAbPX',
                new BN(tokenAAmount),
                new BN(swaps)
              );
            }}
            disabled={tokenAAmount === 0 || endDateTime === undefined}
            bg="#62AAFF"
            color="#FFFFFF"
            width={'100%'}
            borderRadius={'60px'}
          >
            Deposit
          </Button>
        </VStack>
      </DepositRow>
    </Container>
  );
};
