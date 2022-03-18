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
import Decimal from 'decimal.js';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import { useNetwork } from '../contexts/NetworkContext';
import { useTokenABalance, useVaultClient } from '../hooks/VaultClient';
import { BN } from '@project-serum/anchor';
import { solscanTxUrl } from '../utils/block-explorer';
import 'react-datepicker/dist/react-datepicker.css';
import { useTokenMintInfo } from '../hooks/TokenMintInfo';
import { formatTokenAmount } from '../utils/format';

// TODO: Finalize the border-shadow on this
const Container = styled.div`
  padding: 40px 50px 40px 50px;
  height: 600px;
  width: 500px;
  background: #101010;
  border-radius: 60px;
  box-shadow: 0 0 128px 1px rgba(98, 170, 255, 0.15);

  .react-datepicker__triangle {
    border-bottom-color: #262626 !important;
    &::before,
    &::after {
      border-bottom-color: #262626 !important;
    }
  }

  .react-datepicker {
    border-radius: 20px;
    font-size: 0.8rem;
    background-color: #262626;
    color: rgba(255, 255, 255, 0.4);
    border: 0px;
    border-radius: 0;
    display: inline-block;
    position: relative;

    .react-datepicker__header {
      background-color: #262626;
    }

    .react-datepicker__time-list {
      background-color: #262626;
    }

    .react-datepicker__day--disabled {
      color: rgba(255, 255, 255, 0.3);
    }

    div {
      color: white;
    }
  }
`;

const DepositRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justtify-content: space-between;
  align-items: center;
  gap: 10px;
`;

const AmountContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
`;

const GranularityContainer = AmountContainer;

const MaxAmount = styled.span`
  cursor: pointer;
  opacity: 0.8;
  transition: 0.2s ease;

  &:hover {
    text-decoration: underline;
    opacity: 1;
    transition: 0.2s ease;
  }
`;

const StyledDatePicker = styled(DatePicker)`
  border-radius: 20px;
  padding: 14px 20px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  width: 100%;
  background: #262626;
  color: white;
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
    <>
      <Box h="20px" />
      <Text>
        <Text as="u">{swaps}</Text>
        {' swaps of '}
        <Text as="u">{dripAmount}</Text>
        {` ${'USDC'} `}
        <Text as="u">{granularity}</Text>
      </Text>
    </>
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
  const tokenAMintInfo = useTokenMintInfo('3btAv45JmtLu8W8ySwYqxyY1P27xcgFTc4jr3shLyfvE');
  const userTokenABlance = useTokenABalance('3btAv45JmtLu8W8ySwYqxyY1P27xcgFTc4jr3shLyfvE');
  const maxTokenALabel =
    userTokenABlance && tokenAMintInfo
      ? `${formatTokenAmount(new BN(userTokenABlance.toString()), tokenAMintInfo.decimals)}`
      : '-';

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
      {/* Drip */}
      <DepositRow>
        <FormControl variant="floating">
          <FormLabel fontSize="20px" htmlFor="drip-select">
            Drip
          </FormLabel>
          <Select
            maxW="70%"
            fontSize="20px"
            size="lg"
            borderRadius="20px"
            bg="#262626"
            id="drip-select"
          >
            <option>USDC</option>
          </Select>
        </FormControl>
        <FormControl variant="floating">
          <AmountContainer>
            <FormLabel fontSize="20px" htmlFor="drip-amount-select">
              max: <MaxAmount>{maxTokenALabel}</MaxAmount>
            </FormLabel>
            <Input
              size="lg"
              ml="-30%"
              w="130%"
              borderRadius="20px"
              id="drip-amount-select"
              placeholder="0"
              bg="#262626"
              type={'number'}
              value={tokenAAmount === 0 ? undefined : tokenAAmount}
              onChange={(event) => setTokenAAmount(Number(event.target.value))}
            />
          </AmountContainer>
        </FormControl>
      </DepositRow>

      {/* To */}
      <Box h="20px" />
      <DepositRow>
        <FormControl variant="floating">
          <FormLabel fontSize="20px" htmlFor="drip-select">
            Drip
          </FormLabel>
          <Select
            maxW="70%"
            fontSize="20px"
            size="lg"
            borderRadius="20px"
            bg="#262626"
            id="drip-select"
          >
            <option>USDC</option>
          </Select>
        </FormControl>
        <FormControl variant="floating">
          <GranularityContainer>
            <FormLabel fontSize="20px" htmlFor="granularity-select">
              Granularity
            </FormLabel>
            <Select
              size="lg"
              ml="-30%"
              w="130%"
              borderRadius="20px"
              bg="#262626"
              id="granularity-select"
              onChange={(option) => {
                setGranularity(option.target.selectedOptions[0].text as Granularity);
              }}
              value={granularity}
            >
              {Object.values(Granularity).map((granularity) => (
                <option>{granularity}</option>
              ))}
            </Select>
          </GranularityContainer>
        </FormControl>
      </DepositRow>

      {/* Till */}
      <Box h="20px" />
      <DepositRow>
        <FormControl w="100%" variant="floating">
          <FormLabel fontSize="20px" htmlFor="granularity-select">
            Till
          </FormLabel>
          <StyledDatePicker
            autoComplete="off"
            value={endDateTime?.toISOString()}
            placeholderText="Select end date"
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
        <VStack width={'100%'}>
          {tokenAAmount && endDateTime && granularity
            ? getPreviewText(endDateTime, granularity, tokenAAmount)
            : undefined}
          <Box h="20px" />
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
