import { Box, Button, Center, Text } from '@chakra-ui/react';
import { findVaultPubkey } from '@dcaf-labs/drip-sdk';
import { Granularity } from '@dcaf-labs/drip-sdk/dist/interfaces/drip-admin/params';
import { Network } from '@dcaf-labs/drip-sdk/dist/models';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import Decimal from 'decimal.js';
import { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useDripContext } from '../contexts/DripContext';
import { useNetwork } from '../contexts/NetworkContext';
import { useNetworkAddress } from '../hooks/CurrentNetworkAddress';
import { useDripPreviewText } from '../hooks/DripPreview';
import { useTokenBalance } from '../hooks/TokenBalance';
import { useTokenInfo } from '../hooks/TokenInfo';
import { useTokenAs, useTokenBs } from '../hooks/Tokens';
import { formatTokenAmountStr } from '../utils/token-amount';
import { TransactionButton } from './TransactionButton';
import { DripEndTimePicker } from './DripEndTimePicker';
import { GranularitySelect } from './GranularitySelect';
import { MintButton } from './MintButton';
import { TokenAmountInput } from './TokenAmountInput';
import { TokenSelector } from './TokenSelector';
import { useRefreshContext } from '../contexts/Refresh';
import { Device } from '../utils/ui/css';

const StyledContainer = styled.div`
  padding: 30px;
  background: #101010;
  border-radius: 40px;
  box-shadow: 0 0 128px 1px rgba(98, 170, 255, 0.15);
  width: 320px;

  @media ${Device.MobileL} {
    border-radius: 60px;
  }

  @media ${Device.Tablet} {
    width: 460px;
    padding: 40px;
  }
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
  font-size: 18px;

  @media ${Device.Tablet} {
    font-size: 22px;
  }
`;

export function DepositBox() {
  const refreshContext = useRefreshContext();
  const [tokenA, setTokenA] = useState<PublicKey>();
  const [tokenB, setTokenB] = useState<PublicKey>();
  const [depositAmountStr, setDepositAmountStr] = useState<string>();
  const [granularity, setGranularity] = useState<Granularity>();
  const [dripUntil, setDripUntil] = useState<Date>();

  const wallet = useAnchorWallet();
  const tokenANetworkAddress = useNetworkAddress(tokenA);

  // If the token balance is empty, there is likely no token account for the wallet
  const maximumAmount = useTokenBalance(wallet?.publicKey, tokenANetworkAddress) ?? {
    amount: '0',
    decimals: 1,
    uiAmount: '0',
    uiAmountString: '0'
  };

  const tokenAs = useTokenAs(tokenB);
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

  const isValidDate = useMemo(() => {
    if (!dripUntil || !granularity) return false;

    const now = new Date();
    const diff = dripUntil.getTime() / 1e3 - now.getTime() / 1e3;

    return diff >= granularity;
  }, [dripUntil]);

  function isWithinMaxAmount() {
    if (depositAmountStr == null || maximumAmount.uiAmount == null) {
      return true;
    }
    const depositNum = Number(depositAmountStr);
    const maxNum = Number(maximumAmount.uiAmount);
    return depositNum <= maxNum;
  }

  const readyToDeposit = Boolean(
    tokenA &&
      tokenB &&
      depositAmountStr &&
      Number(depositAmountStr) > 0 &&
      granularity &&
      dripUntil &&
      isValidDate
  );
  const hasSufficientFunds = isWithinMaxAmount();
  const ableToDeposit = readyToDeposit && hasSufficientFunds;

  const drip = useDripContext();
  const network = useNetwork();

  const onSubmitSuccess = () => {
    refreshContext.forceRefresh();
    setDripUntil(undefined);
    setGranularity(undefined);
    setTokenA(undefined);
    setTokenB(undefined);
    setDepositAmountStr('');
  };

  const onSubmitFailure = () => {
    refreshContext.forceRefresh();
  };

  const deposit = useCallback(async () => {
    if (!drip) throw new Error('Drip SDK is undefined');
    if (!tokenA) throw new Error('Token A is undefined');
    if (!tokenB) throw new Error('Token B is undefined');
    if (!granularity) throw new Error('Drip Frequency is undefined');
    if (!tokenAInfo) throw new Error('Token A info is undefined');
    if (!depositAmountStr) throw new Error('Deposit Amount is undefined');
    if (!dripUntil) throw new Error('Drip end date is undefined');

    const vaultProtoConfigs = await drip.config.getSupportedVaultProtoConfigsForPair(
      tokenA,
      tokenB
    );

    const vaultProtoConfig = vaultProtoConfigs.find((config) => config.granularity === granularity);
    if (!vaultProtoConfig) {
      throw new Error(`Could not find matching proto config for granularity ${granularity}`);
    }

    const vaultPubkey = findVaultPubkey(drip.programId, {
      protoConfig: vaultProtoConfig.pubkey,
      tokenAMint: tokenA,
      tokenBMint: tokenB
    });
    const dripVault = await drip.getVault(vaultPubkey);

    const depositAmountRaw = new BN(
      new Decimal(depositAmountStr).mul(new Decimal(10).pow(tokenAInfo.decimals)).round().toString()
    );

    const txInfo = await dripVault.depositWithMetadata({
      amount: depositAmountRaw,
      dripParams: {
        expiry: dripUntil
      }
    });
    return txInfo;
  }, [
    drip,
    tokenA,
    tokenB,
    granularity,
    tokenAInfo,
    depositAmountStr,
    dripUntil,
    network,
    refreshContext.forceRefresh
  ]);

  let text = 'Enter details to deposit';
  if (ableToDeposit) {
    text = 'Deposit';
  } else if (!hasSufficientFunds) {
    text = `Not enough ${tokenAInfo?.symbol}`;
  } else if (dripUntil && !isValidDate) {
    text = 'Invalid Date';
  }

  return (
    <StyledContainer>
      <StyledMainRowContainer>
        <StyledSubRowContainer>
          <StyledStepHeader>Drip</StyledStepHeader>
          <div>
            {network === Network.Devnet && tokenA && tokenAInfo && wallet && (
              <MintButton
                marginRight={'20px'}
                mint={tokenA.toBase58()}
                tokenName={tokenAInfo.symbol ?? 'UNKOWN'}
                wallet={wallet.publicKey.toBase58()}
                amount={'500'}
              />
            )}
            {tokenAInfo && (
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
          </div>
        </StyledSubRowContainer>
        <Box h="10px" />
        <StyledSubRowContainer>
          <TokenSelector
            modalTitle="Select Token A"
            placeholder="Select Token A"
            onClearToken={() => {
              setTokenA(undefined);
              setDepositAmountStr('');
            }}
            onSelectToken={(token) => {
              setTokenA(token);
              setDepositAmountStr('');
              setGranularity(undefined);
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
            modalTitle="Select Token B"
            placeholder="Select Token B"
            onClearToken={() => {
              setTokenB(undefined);
            }}
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
              value={dripUntil}
              granularity={granularity}
              onUpdate={setDripUntil}
              disabled={!granularity}
            />
          </Center>
        </StyledSubRowContainer>
      </StyledMainRowContainer>
      <Box h="20px" />
      <StyledMainRowContainer>
        <StyledSubRowContainer>
          {readyToDeposit && dripUntil && isValidDate && (
            <Center w="100%">
              <Text
                css={{
                  fontSize: '8px',
                  [`@media ${Device.Tablet}`]: {
                    fontSize: '13px'
                  }
                }}
                overflow="hidden"
              >
                {dripPreviewText}
              </Text>
            </Center>
          )}
          {dripUntil && granularity && !isValidDate && (
            <Center w="100%">
              <Text
                css={{
                  fontSize: '8px',
                  [`@media ${Device.Tablet}`]: {
                    fontSize: '13px'
                  }
                }}
                overflow="hidden"
              >
                Enter a future date (minimum 2 drips required)
              </Text>
            </Center>
          )}
        </StyledSubRowContainer>
        <StyledSubRowContainer>
          <Center w="100%">
            <TransactionButton
              disabled={!ableToDeposit}
              text={text}
              mt="10px"
              sendTx={deposit}
              onSucess={onSubmitSuccess}
              onError={onSubmitFailure}
            />
          </Center>
        </StyledSubRowContainer>
      </StyledMainRowContainer>
    </StyledContainer>
  );
}
