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
import { useTokenMintInfo } from '../hooks/TokenMintInfo';
import { formatTokenAmount } from '../utils/token-amount';
import Config from '../config.json';
import Decimal from 'decimal.js';

// interface VaultConfig {
//   vault: string;
//   vaultTokenAAccount: string;
//   vaultTokenBAccount: string;
//   vaultProtoConfig: string;
//   vaultProtoConfigGranularity: number;
//   tokenAMint: string;
//   tokenASymbol: string;
//   tokenBMint: string;
//   tokenBSymbol: string;
// }
// let vaultConfigs = Config as VaultConfig[];
// // TODO: Finalize the border-shadow on this
// const Container = styled.div`
//   padding: 40px 50px 40px 50px;
//   width: 500px;
//   background: #101010;
//   border-radius: 60px;
//   box-shadow: 0 0 128px 1px rgba(98, 170, 255, 0.15);

//   .react-datepicker__triangle {
//     border-bottom-color: #262626 !important;
//     &::before,
//     &::after {
//       border-bottom-color: #262626 !important;
//     }
//   }

//   .react-datepicker {
//     border-radius: 20px;
//     font-size: 0.8rem;
//     background-color: #262626;
//     color: rgba(255, 255, 255, 0.4);
//     border: 0px;
//     border-radius: 0;
//     display: inline-block;
//     position: relative;

//     .react-datepicker__header {
//       background-color: #262626;
//     }

//     .react-datepicker__time-list {
//       background-color: #262626;
//     }

//     .react-datepicker__day--disabled {
//       color: rgba(255, 255, 255, 0.3);
//     }

//     div {
//       color: white;
//     }
//   }
// `;

// const DepositRow = styled.div`
//   width: 100%;
//   display: flex;
//   flex-direction: row;
//   justtify-content: space-between;
//   align-items: center;
//   gap: 10px;
// `;

// const AmountContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: flex-end;
// `;

// const GranularityContainer = AmountContainer;

// const MaxAmount = styled.span`
//   cursor: pointer;
//   opacity: 0.8;
//   transition: 0.2s ease;

//   &:hover {
//     text-decoration: underline;
//     opacity: 1;
//     transition: 0.2s ease;
//   }
// `;

// const StyledDatePicker = styled(DatePicker)`
//   border-radius: 20px;
//   padding: 14px 20px;
//   border: 1px solid rgba(255, 255, 255, 0.16);
//   width: 100%;
//   background: #262626;
//   color: white;
// `;

// // TODO(Mocha): Refactor styles
// // TODO(Mocha): The form should be its own component

// enum Granularity {
//   Minutely = 'Minutely',
//   Hourly = 'Hourly',
//   Daily = 'Daily',
//   Weekly = 'Weekly',
//   Monthly = 'Monthly'
// }

// function granularityToUnix(granularity: Granularity): number {
//   switch (granularity) {
//     case Granularity.Minutely:
//       return 60;
//     case Granularity.Hourly:
//       return 60 * 60;
//     case Granularity.Daily:
//       return 60 * 60 * 24;
//     case Granularity.Weekly:
//       return 60 * 60 * 24 * 7;
//     case Granularity.Monthly:
//       return 60 * 60 * 24 * 30;
//   }
// }

// function getNumSwaps(startTime: Date, endTime: Date, granularity: Granularity): number {
//   return Math.floor(
//     (endTime.getTime() - startTime.getTime()) / 1000 / granularityToUnix(granularity)
//   );
// }

// function getPreviewText(
//   endDateTime: Date,
//   granularity: Granularity,
//   tokenAAmount: number,
//   tokenASymbol: string
// ) {
//   const swaps = getNumSwaps(new Date(), endDateTime, granularity);
//   const dripAmount = Math.floor(tokenAAmount / swaps);
//   return (
//     <>
//       <Box h="20px" />
//       <Text>
//         <Text as="u">{swaps}</Text>
//         {' swaps of '}
//         <Text as="u">{dripAmount}</Text>
//         {` ${tokenASymbol} `}
//         <Text as="u">{granularity}</Text>
//       </Text>
//     </>
//   );
// }

// export const DepositBox = () => {
//   const [endDateTime, setEndDateTime] = useState<Date | undefined>();
//   const [tokenAAmount, setTokenAAmount] = useState<number>(0);
//   const [granularity, setGranularity] = useState(Granularity.Minutely);
//   const [vaultConfig, setVaultConfig] = useState<VaultConfig>(vaultConfigs[0]);
//   const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

//   console.log('tokenAAmount:', tokenAAmount);
//   console.log('endDateTime:', Math.floor(endDateTime?.getTime() ?? 0 / 1000));
//   console.log('granularity:', granularity);
//   console.log('vaultConfig', vaultConfig);

//   const tokenAToMint: Record<string, string> = {};
//   const tokenBToMint: Record<string, string> = {};
//   vaultConfigs = vaultConfigs.filter((c) => c.vaultProtoConfigGranularity !== 10);
//   vaultConfigs.forEach((c) => {
//     tokenAToMint[c.tokenASymbol] = c.tokenAMint;

//     if (c.tokenASymbol === vaultConfig.tokenASymbol) {
//       tokenBToMint[c.tokenBSymbol] = c.tokenBMint;
//     }
//   });

//   // TODO(Mocha): this is base values rn, we need decimals
//   const tokenAMintInfo = useTokenMintInfo(vaultConfig.tokenAMint);
//   const userTokenABlance = useTokenABalance(vaultConfig.tokenAMint);
//   const maxTokenALabel =
//     userTokenABlance && tokenAMintInfo
//       ? `${formatTokenAmount(new BN(userTokenABlance.toString()), tokenAMintInfo.decimals)}`
//       : '-';

//   const baseAmount = new BN(tokenAAmount).mul(
//     new BN(10).pow(new BN(tokenAMintInfo?.decimals ?? 1))
//   );

//   const network = useNetwork();
//   const vaultClient = useVaultClient(network);
//   const toast = useToast();

//   async function handleDeposit(vault: string, baseAmount: BN, numberOfCycles: BN) {
//     setIsSubmitDisabled(true);
//     try {
//       const result = await vaultClient.deposit(vault, baseAmount, numberOfCycles);
//       toast({
//         title: 'Deposit successful',
//         description: (
//           <>
//             <Box>
//               <Code colorScheme="black">{result.publicKey.toBase58()}</Code>
//             </Box>
//             <Box>
//               <Link href={solscanTxUrl(result.txHash, network)} isExternal>
//                 Solscan
//               </Link>
//             </Box>
//           </>
//         ),
//         status: 'success',
//         duration: 9000,
//         isClosable: true,
//         position: 'top-right'
//       });
//     } catch (err) {
//       console.error(err);
//       toast({
//         title: 'Deposit failed',
//         description: (err as Error).message,
//         status: 'error',
//         duration: 9000,
//         isClosable: true,
//         position: 'top-right'
//       });
//     }
//     setIsSubmitDisabled(false);
//   }

//   return (
//     <Container>
//       {/* Drip */}
//       <DepositRow>
//         <FormControl variant="floating">
//           <FormLabel fontSize="20px" htmlFor="drip-select">
//             Drip
//           </FormLabel>
//           <Select
//             maxW="70%"
//             fontSize="20px"
//             size="lg"
//             borderRadius="20px"
//             bg="#262626"
//             id="drip-select"
//             value={vaultConfig.tokenASymbol}
//             onChange={(event) => {
//               const newTokenA = event.target.selectedOptions[0].text;
//               // reset fields if they are no longer valid
//               const newValidConfig = vaultConfigs.filter(
//                 (c) =>
//                   c.tokenASymbol === newTokenA &&
//                   c.tokenBSymbol == vaultConfig.tokenBSymbol &&
//                   c.vaultProtoConfigGranularity === vaultConfig.vaultProtoConfigGranularity
//               );
//               if (!newValidConfig.length) {
//                 // Don't need to reset granularity, all granularties will be support per pair
//                 setVaultConfig(
//                   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//                   vaultConfigs.find(
//                     (c) =>
//                       c.tokenASymbol === newTokenA &&
//                       c.vaultProtoConfigGranularity === vaultConfig.vaultProtoConfigGranularity
//                   )!
//                 );
//               }
//               setVaultConfig(newValidConfig[0]);
//             }}
//           >
//             {Object.keys(tokenAToMint).map((symbol) => (
//               <option>{symbol}</option>
//             ))}
//           </Select>
//         </FormControl>
//         <FormControl variant="floating">
//           <AmountContainer>
//             <FormLabel fontSize="20px" htmlFor="drip-amount-select">
//               max:{' '}
//               <MaxAmount
//                 onClick={() =>
//                   setTokenAAmount(
//                     new Decimal(userTokenABlance?.toString() ?? '0')
//                       .div(new Decimal(10).pow(tokenAMintInfo?.decimals ?? 1))
//                       .toNumber()
//                   )
//                 }
//               >
//                 {maxTokenALabel}
//               </MaxAmount>
//             </FormLabel>
//             <Input
//               size="lg"
//               ml="-30%"
//               w="130%"
//               borderRadius="20px"
//               id="drip-amount-select"
//               placeholder="0"
//               bg="#262626"
//               type={'number'}
//               value={tokenAAmount === 0 ? undefined : tokenAAmount}
//               onChange={(event) => {
//                 const newTokenAAmount = Number(event.target.value);
//                 setIsSubmitDisabled(newTokenAAmount === 0 || endDateTime === undefined);
//                 if (userTokenABlance && BigInt(newTokenAAmount) <= userTokenABlance) {
//                   setTokenAAmount(newTokenAAmount);
//                 }
//               }}
//             />
//           </AmountContainer>
//         </FormControl>
//       </DepositRow>

//       {/* To */}
//       <Box h="20px" />
//       <DepositRow>
//         <FormControl variant="floating">
//           <FormLabel fontSize="20px" htmlFor="drip-select">
//             Drip
//           </FormLabel>
//           <Select
//             maxW="70%"
//             fontSize="20px"
//             size="lg"
//             borderRadius="20px"
//             bg="#262626"
//             id="drip-select"
//             value={vaultConfig.tokenBSymbol}
//             onChange={(event) => {
//               const newTokenB = event.target.selectedOptions[0].text;
//               const newValidConfig = vaultConfigs.filter(
//                 (c) =>
//                   c.tokenBSymbol === newTokenB &&
//                   c.tokenASymbol == vaultConfig.tokenASymbol &&
//                   c.vaultProtoConfigGranularity === vaultConfig.vaultProtoConfigGranularity
//               );
//               setVaultConfig(newValidConfig[0]);
//             }}
//           >
//             {Object.keys(tokenBToMint).map((symbol) => (
//               <option>{symbol}</option>
//             ))}
//           </Select>
//         </FormControl>
//         <FormControl variant="floating">
//           <GranularityContainer>
//             <FormLabel fontSize="20px" htmlFor="granularity-select">
//               Granularity
//             </FormLabel>
//             <Select
//               size="lg"
//               ml="-30%"
//               w="130%"
//               borderRadius="20px"
//               bg="#262626"
//               id="granularity-select"
//               onChange={(event) => {
//                 const newGranularity = event.target.selectedOptions[0].text as Granularity;
//                 const newValidConfig = vaultConfigs.filter(
//                   (c) =>
//                     c.tokenBSymbol === vaultConfig.tokenBSymbol &&
//                     c.tokenASymbol == vaultConfig.tokenASymbol &&
//                     c.vaultProtoConfigGranularity === granularityToUnix(newGranularity)
//                 );
//                 setGranularity(newGranularity);
//                 setVaultConfig(newValidConfig[0]);
//               }}
//               value={granularity}
//             >
//               {Object.values(Granularity).map((granularity) => (
//                 <option>{granularity}</option>
//               ))}
//             </Select>
//           </GranularityContainer>
//         </FormControl>
//       </DepositRow>

//       {/* Till */}
//       <Box h="20px" />
//       <DepositRow>
//         <FormControl w="100%" variant="floating">
//           <FormLabel fontSize="20px" htmlFor="granularity-select">
//             Till
//           </FormLabel>
//           <StyledDatePicker
//             autoComplete="off"
//             value={endDateTime?.toISOString()}
//             placeholderText="Select end date"
//             id="granularity-select"
//             selected={endDateTime}
//             minDate={new Date()}
//             onChange={(date: Date) => {
//               setIsSubmitDisabled(tokenAAmount === 0 || date === undefined);
//               setEndDateTime(date);
//             }}
//             showTimeSelect={
//               granularity == Granularity.Minutely || granularity == Granularity.Hourly
//             }
//             timeIntervals={
//               granularity == Granularity.Minutely
//                 ? 1
//                 : granularity == Granularity.Hourly
//                 ? 60
//                 : undefined
//             }
//           />
//         </FormControl>
//       </DepositRow>
//       {/* Preview and Deposit */}
//       <DepositRow>
//         <VStack width={'100%'}>
//           {tokenAAmount && endDateTime && granularity
//             ? getPreviewText(endDateTime, granularity, tokenAAmount, vaultConfig.tokenASymbol)
//             : undefined}
//           <Box h="20px" />
//           <Button
//             onClick={() => {
//               const swaps = getNumSwaps(new Date(), endDateTime ?? new Date(), granularity);
//               handleDeposit(vaultConfig.vault, baseAmount, new BN(swaps));
//             }}
//             disabled={isSubmitDisabled}
//             bg="#62AAFF"
//             color="#FFFFFF"
//             width={'100%'}
//             borderRadius={'60px'}
//           >
//             Deposit
//           </Button>
//         </VStack>
//       </DepositRow>
//     </Container>
//   );
// };
