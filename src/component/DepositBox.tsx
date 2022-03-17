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

import 'react-datepicker/dist/react-datepicker.css';
import { useNetwork } from '../contexts/NetworkContext';
import { useVaultClient } from '../hooks/VaultClient';
import { BN } from '@project-serum/anchor';
import { solscanTxUrl } from '../utils/block-explorer';

// TODO: Finalize the border-shadow on this
const Container = styled.div`
  padding: 20px;
  height: 600px;
  width: 500px;
  background: #101010;
  border-radius: 60px;
  box-shadow: 0 0 128px 1px rgba(98, 170, 255, 0.15);
`;

const DatePickerContaner = styled.div`
  padding: 20px;
  width: 100%;
  border-radius: 60px;
`;

const DepositRow = styled.div`
  padding: 40px 40px 0px 40px;
`;

interface DepositFormProps {
  maxTokenA?: number;
}
// TODO(Mocha): Refactor styles
// TODO(Mocha): The form should be its own component
export const DepositBox = (props: DepositFormProps) => {
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [tokenAAmount, setTokenAAmount] = useState<number | undefined>();
  const [granularity, setGranularity] = useState('Minutely');

  const maxTokenALabel = props.maxTokenA ? `max: ${props.maxTokenA}` : `-`;

  const network = useNetwork();
  const vaultClient = useVaultClient(network);
  const toast = useToast();

  async function handleDeposit() {
    try {
      const result = await vaultClient.deposit(
        '8NmRaD8gvZiomrzoXsuJRFU742WK6DBaW4Wanw1xAbPX',
        new BN(1000 * 1e6),
        new BN(10)
      );

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
        title: 'Vault creation failed',
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
            {/* TODO(Mocha): Right align */}
            {/* TODO(Mocha): Change Text Style */}
            <FormLabel htmlFor="drip-amount-select">{maxTokenALabel}</FormLabel>
            <Input
              id="drip-amount-select"
              placeholder="0"
              bg="#262626"
              type={'number'}
              value={tokenAAmount}
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
                console.log(option);
                console.log(granularity);
                setGranularity(option.target.selectedOptions[0].text);
              }}
              value={granularity}
            >
              <option>Minutely</option>
              <option>Hourly</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </Select>
          </FormControl>
        </HStack>
      </DepositRow>
      {/* Till */}
      <DepositRow>
        <FormControl variant="floating">
          <FormLabel htmlFor="granularity-select">Till</FormLabel>
          <DatePickerContaner>
            <DatePicker
              id="granularity-select"
              selected={endDateTime}
              onChange={(date: Date) => setEndDateTime(date)}
              showTimeSelect={granularity == 'Minutely' || granularity == 'Hourly'}
              timeIntervals={
                granularity == 'Minutely' ? 1 : granularity == 'Hourly' ? 60 : undefined
              }
            />
          </DatePickerContaner>
        </FormControl>
      </DepositRow>
      {/* Preview and Deposit */}
      <DepositRow>
        <VStack>
          <Text>{'Previe Text'}</Text>
          <Button onClick={handleDeposit} bg="#62AAFF" color="#FFFFFF">
            Deposit
          </Button>
        </VStack>
      </DepositRow>
    </Container>
  );
};
