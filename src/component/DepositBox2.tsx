import { Box, Button, Center, Text } from '@chakra-ui/react';
import { findVaultPubkey } from '@dcaf-protocol/drip-sdk';
import { Granularity } from '@dcaf-protocol/drip-sdk/dist/interfaces/drip-admin/params';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import Decimal from 'decimal.js';
import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useDripContext } from '../contexts/DripContext';
import { useNetwork } from '../contexts/NetworkContext';
import { useNetworkAddress } from '../hooks/CurrentNetworkAddress';
import { useDripPreviewText } from '../hooks/DripPreview';
import { useTokenBalance } from '../hooks/TokenBalance';
import { useTokenInfo } from '../hooks/TokenInfo';
import { useTokenAs, useTokenBs } from '../hooks/Tokens';
import { formatTokenAmountStr } from '../utils/token-amount';
import { DepositButton } from './DepositButton';
import { DripEndTimePicker } from './DripEndTimePicker';
import { GranularitySelect } from './GranularitySelect';
import { TokenAmountInput } from './TokenAmountInput';
import { TokenSelector } from './TokenSelect';

const StyledContainer = styled.div`
  padding: 40px;
  width: 520px;
  background: #101010;
  border-radius: 60px;
  box-shadow: 0 0 128px 1px rgba(98, 170, 255, 0.15);
`;

const StyledMainRowContainer = styled.div`
  width: 100%;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledSubRowContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const StyledStepHeader = styled(Text)`
  font-weight: bold;
  font-size: 22px;
`;

export function DepositBox() {
  const [tokenA, setTokenA] = useState<PublicKey>();
  const [tokenB, setTokenB] = useState<PublicKey>();
  const [depositAmountStr, setDepositAmountStr] = useState<string>();
  const [granularity, setGranularity] = useState<Granularity>();
  const [dripUntil, setDripUntil] = useState<Date>();
  const wallet = useAnchorWallet();
  const tokenANetworkAddress = useNetworkAddress(tokenA);
  const maximumAmount = useTokenBalance(wallet?.publicKey, tokenANetworkAddress);

  const tokenAs = useTokenAs();
  const tokenBs = useTokenBs(tokenA);
  const tokenAAddr = useNetworkAddress(tokenA);
  const tokenBAddr = useNetworkAddress(tokenB);
  const tokenAInfo = useTokenInfo(tokenAAddr);
  const tokenBInfo = useTokenInfo(tokenBAddr);

  const dripPreviewText = useDripPreviewText(
    tokenAInfo?.symbol,
    tokenBInfo?.symbol,
    depositAmountStr,
    granularity,
    dripUntil
  );

  const readyToDeposit = Boolean(
    tokenA && tokenB && depositAmountStr && Number(depositAmountStr) > 0 && granularity && dripUntil
  );

  const drip = useDripContext();
  const network = useNetwork();
  const deposit = useCallback(async () => {
    if (!drip) throw new Error('Drip SDK is undefined');
    if (!tokenA) throw new Error('Token A is undefined');
    if (!tokenB) throw new Error('Token B is undefined');
    if (!granularity) throw new Error('Granularity/Velocity is undefined');
    if (!tokenAInfo) throw new Error('Token A info is undefined');
    if (!depositAmountStr) throw new Error('Deposit Amount is undefined');
    if (!dripUntil) throw new Error('Drip end date is undefined');

    const vaultProtoConfigs = await drip.querier.getSupportedVaultProtoConfigsForPair(
      tokenA,
      tokenB
    );

    const vaultProtoConfig = vaultProtoConfigs.find((config) => config.granularity === granularity);

    if (!vaultProtoConfig) {
      throw new Error(`Could not find matching proto config for granularity ${granularity}`);
    }

    const vaultPubkey = findVaultPubkey(drip.getProgramId(network), {
      protoConfig: vaultProtoConfig.pubkey,
      tokenAMint: tokenA,
      tokenBMint: tokenB
    });

    const dripVault = await drip.getVault(vaultPubkey);

    const depositAmountRaw = new BN(
      new Decimal(depositAmountStr).mul(new Decimal(10).pow(tokenAInfo.decimals)).round().toString()
    );

    return await dripVault.deposit({
      amount: depositAmountRaw,
      dcaParams: {
        expiry: dripUntil
      }
    });
  }, [drip, tokenA, tokenB, granularity, tokenAInfo, depositAmountStr, dripUntil, network]);

  return (
    <StyledContainer>
      <StyledMainRowContainer>
        <StyledSubRowContainer>
          <StyledStepHeader>Drip</StyledStepHeader>
          {maximumAmount && (
            <Button
              h="20px"
              transition="0.2s ease"
              color="whiteAlpha.800"
              variant="unstyled"
              cursor="pointer"
              onClick={() => {
                setDepositAmountStr(
                  maximumAmount.uiAmountString ??
                    formatTokenAmountStr(maximumAmount.amount, maximumAmount.decimals)
                );
              }}
              _hover={{ color: 'white', textDecoration: 'underline', transition: '0.2s ease' }}
            >
              Max: {formatTokenAmountStr(maximumAmount.amount, maximumAmount.decimals, true)}
            </Button>
          )}
        </StyledSubRowContainer>
        <Box h="10px" />
        <StyledSubRowContainer>
          <TokenSelector
            modalTitle="Select Token A"
            placeholder="Select Token A"
            onSelectToken={(token) => {
              setTokenA(token);
              setDepositAmountStr(undefined);
              setGranularity(undefined);
              setTokenB(undefined);
              setDripUntil(undefined);
            }}
            selectedToken={tokenA}
            tokens={tokenAs}
          />
          <TokenAmountInput
            amount={depositAmountStr}
            onUpdate={(value) => {
              setDepositAmountStr(value);
            }}
            disabled={!tokenA}
          />
        </StyledSubRowContainer>
      </StyledMainRowContainer>
      <StyledMainRowContainer>
        <StyledSubRowContainer>
          <StyledStepHeader>To</StyledStepHeader>
        </StyledSubRowContainer>
        <Box h="10px" />
        <StyledSubRowContainer>
          <TokenSelector
            disabled={!tokenA}
            modalTitle="Select Token B"
            placeholder="Select Token B"
            onSelectToken={setTokenB}
            selectedToken={tokenB}
            tokens={tokenBs}
          />
          <GranularitySelect onUpdate={setGranularity} tokenA={tokenA} tokenB={tokenB} />
        </StyledSubRowContainer>
      </StyledMainRowContainer>
      <StyledMainRowContainer>
        <StyledSubRowContainer>
          <StyledStepHeader>Till</StyledStepHeader>
        </StyledSubRowContainer>
        <Box h="10px" />
        <StyledSubRowContainer>
          <Center w="100%">
            <DripEndTimePicker
              enableTimeSelect={Boolean(
                granularity && [Granularity.Minutely, Granularity.Hourly].includes(granularity)
              )}
              value={dripUntil}
              onUpdate={setDripUntil}
              disabled={!granularity}
            />
          </Center>
        </StyledSubRowContainer>
      </StyledMainRowContainer>
      <Box h="20px" />
      <StyledMainRowContainer>
        <StyledSubRowContainer>
          <Center w="100%">
            <Text>{dripPreviewText}</Text>
          </Center>
        </StyledSubRowContainer>
        <StyledSubRowContainer>
          <Center w="100%">
            <DepositButton
              disabled={!readyToDeposit}
              text={readyToDeposit ? undefined : 'Enter details to deposit'}
              mt="10px"
              deposit={deposit}
            />
          </Center>
        </StyledSubRowContainer>
      </StyledMainRowContainer>
    </StyledContainer>
  );
}
