import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Text,
  useToast,
  Box,
  Code,
  Link,
  MenuItemOption,
  NumberInput,
  NumberInputField
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import { useNetwork } from '../contexts/NetworkContext';
import { useTokenABalance, useVaultClient } from '../hooks/VaultClient';
import { BN } from '@project-serum/anchor';
import { solscanTxUrl } from '../utils/block-explorer';
import 'react-datepicker/dist/react-datepicker.css';
import { useTokenMintInfo } from '../hooks/TokenMintInfo';
import { formatTokenAmount, parseTokenAmount } from '../utils/token-amount';
import Config from '../config.json';
import Decimal from 'decimal.js';
import { Token, ZERO } from '@dcaf/drip-sdk';
import { useDripContext } from '../contexts/DripContext';
import { useStateRefresh } from '../hooks/StateRefresh';

interface VaultConfig {
  vault: string;
  vaultTokenAAccount: string;
  vaultTokenBAccount: string;
  vaultProtoConfig: string;
  vaultProtoConfigGranularity: number;
  tokenAMint: string;
  tokenASymbol: string;
  tokenBMint: string;
  tokenBSymbol: string;
}
// TODO: Finalize the border-shadow on this
const Container = styled.div`
  padding: 40px 50px 40px 50px;
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

const StyledDatePicker = styled(DatePicker)<{ disabled?: boolean }>`
  border-radius: 20px;
  padding: 14px 20px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  width: 100%;
  background: #262626;
  color: white;

  ${({ disabled }) => (disabled ? `opacity: 0.3` : '')}
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
      return 60 * 60 * 24 * 30;
  }
}

function getNumSwaps(startTime: Date, endTime: Date, granularity: Granularity): number {
  return Math.floor(
    (endTime.getTime() - startTime.getTime()) / 1000 / granularityToUnix(granularity)
  );
}

function getPreviewText(
  endDateTime: Date,
  granularity: Granularity,
  tokenAAmount: BN,
  tokenASymbol: string,
  tokenADecimals: number
) {
  const swaps = getNumSwaps(new Date(), endDateTime, granularity);
  const dripAmount = tokenAAmount.div(new BN(swaps));
  return (
    <>
      <Box h="20px" />
      <Text>
        <Text as="u">{swaps}</Text>
        {' swaps of '}
        <Text as="u">{formatTokenAmount(dripAmount, tokenADecimals)}</Text>
        {` ${tokenASymbol} `}
        <Text as="u">{granularity}</Text>
      </Text>
    </>
  );
}

enum DepositStage {
  TokenASelection,
  DepositAmountEntry,
  TokenBSelection,
  GranularitySelection,
  ExpiryDateSelection,
  ReadyToDeposit
}

export const DepositBox = () => {
  // const [endDateTime, setEndDateTime] = useState<Date | undefined>();
  // const [tokenAAmount, setTokenAAmount] = useState<number>(0);
  // const [granularity, setGranularity] = useState(Granularity.Minutely);
  // const [vaultConfig, setVaultConfig] = useState<VaultConfig>(vaultConfigs[0]);
  // const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [tokenAAmount, setTokenAAmount] = useState<BN>(ZERO);
  const [depositStage, setDepositStage] = useState<DepositStage>(DepositStage.TokenASelection);
  const refreshTrigger = useStateRefresh();
  const drip = useDripContext();
  const [tokenA, setTokenA] = useState<Token>();
  const [tokenB, setTokenB] = useState<Token>();
  const [tokenARecord, setTokenARecord] = useState<Record<string, Token>>();
  const [tokenBRecord, setTokenBRecord] = useState<Record<string, Token>>();
  const [granularity, setGranularity] = useState<Granularity>(Granularity.Minutely);
  const [endDate, setEndDate] = useState<Date>();

  useEffect(() => {
    (async () => {
      if (!drip) return;

      const tokenAs = await drip.querier.getAllTokenAs();
      setTokenARecord(tokenAs);
    })();
  }, [drip, refreshTrigger]);

  useEffect(() => {
    (async () => {
      if (!tokenA || !drip) return;
      const tokenBs = await drip.querier.getAllTokenBs(tokenA.mint);
      setTokenBRecord(tokenBs);
    })();
  }, [tokenA, drip, refreshTrigger]);

  // const tokenAToMint: Record<string, string> = {};
  // const tokenBToMint: Record<string, string> = {};
  // vaultConfigs = vaultConfigs.filter((c) => c.vaultProtoConfigGranularity !== 10);
  // vaultConfigs.forEach((c) => {
  //   tokenAToMint[c.tokenASymbol] = c.tokenAMint;

  //   if (c.tokenASymbol === vaultConfig.tokenASymbol) {
  //     tokenBToMint[c.tokenBSymbol] = c.tokenBMint;
  //   }
  // });

  // TODO(Mocha): this is base values rn, we need decimals
  const tokenAMintInfo = useTokenMintInfo(tokenA?.mint);
  const userTokenABalance = useTokenABalance(tokenA?.mint?.toBase58());
  const maxTokenADisplay = tokenAMintInfo
    ? `${formatTokenAmount(userTokenABalance, tokenAMintInfo.decimals)}`
    : '-';

  // const baseAmount = new BN(tokenAAmount).mul(
  //   new BN(10).pow(new BN(tokenAMintInfo?.decimals ?? 1))
  // );

  // const network = useNetwork();
  // const vaultClient = useVaultClient(network);
  // const toast = useToast();

  // async function handleDeposit(vault: string, baseAmount: BN, numberOfCycles: BN) {
  //   setIsSubmitDisabled(true);
  //   try {
  //     const result = await vaultClient.deposit(vault, baseAmount, numberOfCycles);
  //     toast({
  //       title: 'Deposit successful',
  //       description: (
  //         <>
  //           <Box>
  //             <Code colorScheme="black">{result.publicKey.toBase58()}</Code>
  //           </Box>
  //           <Box>
  //             <Link href={solscanTxUrl(result.txHash, network)} isExternal>
  //               Solscan
  //             </Link>
  //           </Box>
  //         </>
  //       ),
  //       status: 'success',
  //       duration: 9000,
  //       isClosable: true,
  //       position: 'top-right'
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     toast({
  //       title: 'Deposit failed',
  //       description: (err as Error).message,
  //       status: 'error',
  //       duration: 9000,
  //       isClosable: true,
  //       position: 'top-right'
  //     });
  //   }
  //   setIsSubmitDisabled(false);
  // }

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
            placeholder="Token A"
            disabled={depositStage < DepositStage.TokenASelection}
            value={tokenA?.mint?.toBase58() || ''}
            onChange={(event) => {
              setEndDate(undefined);
              const mint = event.target.selectedOptions[0].value;

              if (!tokenARecord) return;

              if (!tokenARecord[mint]) {
                if (mint === '') {
                  setTokenA(tokenARecord[mint]);
                  setTokenAAmount(ZERO);
                  setTokenB(undefined);
                  setDepositStage(DepositStage.TokenASelection);
                }

                return;
              }

              setTokenA(tokenARecord[mint]);
              setTokenAAmount(ZERO);
              setDepositStage(DepositStage.DepositAmountEntry);
            }}
          >
            {tokenARecord &&
              Object.values(tokenARecord).map((tokenA) => (
                <option key={tokenA.mint.toBase58()} value={tokenA.mint.toBase58()}>
                  {tokenA.symbol}
                </option>
              ))}
          </Select>
        </FormControl>
        <FormControl variant="floating" isDisabled={depositStage < DepositStage.DepositAmountEntry}>
          <AmountContainer>
            <FormLabel fontSize="20px" htmlFor="drip-amount-select">
              max:{' '}
              <MaxAmount
                onClick={() => {
                  setEndDate(undefined);
                  setDepositStage(DepositStage.TokenBSelection);
                  setTokenAAmount(userTokenABalance);
                }}
              >
                {maxTokenADisplay}
              </MaxAmount>
            </FormLabel>
            <NumberInput
              size="lg"
              value={
                tokenAAmount.isZero() || !tokenAMintInfo
                  ? ''
                  : formatTokenAmount(tokenAAmount, tokenAMintInfo.decimals)
              }
            >
              <NumberInputField
                ml="-30%"
                w="130%"
                borderRadius="20px"
                id="drip-amount-select"
                placeholder="0"
                bg="#262626"
                onChange={(event) => {
                  setEndDate(undefined);
                  const value = event.target.value;

                  if (!tokenAMintInfo) return;
                  if (value.trim() === '') {
                    setTokenAAmount(ZERO);
                    setTokenB(undefined);
                    setDepositStage(DepositStage.DepositAmountEntry);
                    return;
                  }
                  const tokenAmount = parseTokenAmount(value, tokenAMintInfo.decimals);

                  if (tokenAmount.gt(userTokenABalance)) {
                    return;
                  }

                  setDepositStage(DepositStage.TokenBSelection);
                  setTokenAAmount(tokenAmount);
                }}
              />
            </NumberInput>
          </AmountContainer>
        </FormControl>
      </DepositRow>

      {/* To */}
      <Box h="20px" />
      <DepositRow>
        <FormControl variant="floating" isDisabled={depositStage < DepositStage.TokenBSelection}>
          <FormLabel fontSize="20px" htmlFor="drip-select">
            To
          </FormLabel>
          <Select
            maxW="70%"
            fontSize="20px"
            size="lg"
            borderRadius="20px"
            bg="#262626"
            id="drip-select"
            placeholder="Token B"
            value={tokenB?.mint?.toBase58() || ''}
            onChange={(event) => {
              setEndDate(undefined);
              const mint = event.target.selectedOptions[0].value;

              if (!tokenBRecord) return;

              if (!tokenBRecord[mint]) {
                if (mint === '') {
                  setTokenB(tokenBRecord[mint]);
                  setDepositStage(DepositStage.TokenBSelection);
                }

                return;
              }

              setTokenB(tokenBRecord[mint]);
              setDepositStage(DepositStage.GranularitySelection);
            }}
          >
            {tokenBRecord &&
              Object.values(tokenBRecord).map((tokenB) => (
                <option key={tokenB.mint.toBase58()} value={tokenB.mint.toBase58()}>
                  {tokenB.symbol}
                </option>
              ))}
          </Select>
        </FormControl>
        <FormControl
          variant="floating"
          isDisabled={depositStage < DepositStage.GranularitySelection}
        >
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
              onChange={(event) => {
                const newGranularity = event.target.selectedOptions[0].value;
                setGranularity(newGranularity as Granularity);
                setEndDate(undefined);
                setDepositStage(DepositStage.ExpiryDateSelection);
              }}
              value={granularity}
            >
              {Object.values(Granularity).map((granularity) => (
                <option key={granularity} value={granularity}>
                  {granularity}
                </option>
              ))}
            </Select>
          </GranularityContainer>
        </FormControl>
      </DepositRow>

      {/* Till */}
      <Box h="20px" />
      <DepositRow>
        <FormControl
          w="100%"
          variant="floating"
          isDisabled={depositStage < DepositStage.GranularitySelection}
        >
          <FormLabel fontSize="20px" htmlFor="granularity-select">
            Till
          </FormLabel>
          <StyledDatePicker
            autoComplete="off"
            value={endDate?.toISOString() || ''}
            placeholderText="Select end date"
            id="granularity-select"
            disabled={depositStage < DepositStage.GranularitySelection}
            selected={endDate}
            minDate={new Date()}
            onChange={(date: Date) => {
              setEndDate(date);
              setDepositStage(DepositStage.ReadyToDeposit);
            }}
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
          {tokenAAmount && endDate && granularity && tokenA && tokenAMintInfo
            ? getPreviewText(
                endDate,
                granularity,
                tokenAAmount,
                tokenA?.symbol,
                tokenAMintInfo?.decimals
              )
            : undefined}
          <Box h="20px" />
          <Button
            onClick={() => {
              const swaps = getNumSwaps(new Date(), endDate ?? new Date(), granularity);
            }}
            disabled={depositStage < DepositStage.ReadyToDeposit}
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
