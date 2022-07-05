import {
  Box,
  Button,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react';
import { makeExplorerUrl } from '@dcaf-labs/drip-sdk';
import {
  createAssociatedTokenAccountInstruction,
  getAccount,
  getAssociatedTokenAddress,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError
} from '@solana/spl-token';
import { PublicKey, Transaction } from '@solana/web3.js';
import { FC, useCallback, useState } from 'react';
import { useDripContext } from '../contexts/DripContext';
import { useNetwork } from '../contexts/NetworkContext';
import { useTxToast } from '../hooks/TxToast';

export const Vault: FC = () => {
  const [tokenAMint, setTokenAMint] = useState<PublicKey>();
  const [tokenBMint, setTokenBMint] = useState<PublicKey>();
  const [treasuryAccount, setTreasuryAccount] = useState<PublicKey>();
  const [protoConfig, setProtoConfig] = useState<PublicKey>();
  const [isLoading, setIsLoading] = useState(false);

  const txToast = useTxToast();
  const drip = useDripContext();
  const network = useNetwork();

  const createOrGetTreasuryAccount = useCallback(async () => {
    if (!tokenBMint) throw new Error('empty tokenBMint');
    if (!drip) throw new Error('empty drip sdk');
    setIsLoading(true);

    const treasuryTokenBAccount = await getAssociatedTokenAddress(
      tokenBMint,
      drip.provider.wallet.publicKey
    );
    // Get treasury account or create ATA
    try {
      // Account exists
      await getAccount(drip.provider.connection, treasuryTokenBAccount);
      setTreasuryAccount(treasuryTokenBAccount);
    } catch (error: unknown) {
      if (
        error instanceof TokenAccountNotFoundError ||
        error instanceof TokenInvalidAccountOwnerError
      ) {
        try {
          const createATAIx = createAssociatedTokenAccountInstruction(
            drip.provider.wallet.publicKey,
            treasuryTokenBAccount,
            drip.provider.wallet.publicKey,
            tokenBMint
          );
          const txHash = await drip.provider.sendAndConfirm(
            new Transaction().add(createATAIx),
            undefined
          );
          const txInfo = {
            id: txHash,
            explorer: makeExplorerUrl(txHash, network),
            metadata: undefined
          };
          txToast.success(txInfo);
          setTreasuryAccount(treasuryTokenBAccount);
        } catch (error2: unknown) {
          setIsLoading(false);
          txToast.failure(error as Error);
          return;
        }
        // Account doesn't exist, create an ATA
      } else {
        txToast.failure(error as Error);
        return;
      }
    }
    setIsLoading(false);
  }, [drip, network]);

  const deployVault = useCallback(async () => {
    if (!drip) throw new Error('Drip SDK is undefined');
    console.log(tokenAMint?.toBase58(), tokenBMint?.toBase58(), protoConfig?.toBase58());
    if (!tokenAMint || !tokenBMint || !protoConfig || !treasuryAccount) {
      throw new Error('undefined inputs');
    }
    setIsLoading(true);
    // let treasuryTokenBAccount: PublicKey;
    // if (treasuryAccount) {
    //   treasuryTokenBAccount = treasuryAccount;
    // } else {
    //   console.log('using wallet for treasury token b account');
    //   treasuryTokenBAccount = await getAssociatedTokenAddress(
    //     tokenBMint,
    //     drip.provider.wallet.publicKey
    //   );
    // }
    const initVaultTx = await drip.admin.getInitVaultTx({
      protoConfig: protoConfig,
      tokenAMint,
      tokenBMint,
      tokenBFeeTreasury: treasuryAccount
    });

    // // Get treasury account or create ATA
    // try {
    //   // Account exists
    //   await getAccount(drip.provider.connection, treasuryTokenBAccount);
    // } catch (error: unknown) {
    //   if (
    //     error instanceof TokenAccountNotFoundError ||
    //     error instanceof TokenInvalidAccountOwnerError
    //   ) {
    //     // Account doesn't exist, create an ATA
    //     const createATAIx = createAssociatedTokenAccountInstruction(
    //       drip.provider.wallet.publicKey,
    //       treasuryTokenBAccount,
    //       drip.provider.wallet.publicKey,
    //       tokenBMint
    //     );
    //     // Create ATA before initVaultIx
    //     initVaultTx.tx.instructions.unshift(createATAIx);
    //   } else {
    //     txToast.failure(error as Error);
    //     return;
    //   }
    // }

    try {
      const txHash = await drip.provider.sendAndConfirm(initVaultTx.tx, undefined);
      const txInfo = {
        id: txHash,
        explorer: makeExplorerUrl(txHash, network),
        metadata: initVaultTx.metadata
      };
      txToast.success(txInfo);
    } catch (err) {
      txToast.failure(err as Error);
    }
    setIsLoading(true);
  }, [tokenAMint, tokenBMint, protoConfig, drip, network]);

  // async function handleInitVault() {
  //   if (!tokenAMint || !tokenBMint || !protoConfig) {
  //     return;
  //   }

  //   try {
  //     const result = await vaultClient.initVault(tokenAMint, tokenBMint, protoConfig);
  //     toast({
  //       title: 'Vault created',
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
  //     toast({
  //       title: 'Vault creation failed',
  //       description: (err as Error).message,
  //       status: 'error',
  //       duration: 9000,
  //       isClosable: true,
  //       position: 'top-right'
  //     });
  //   }
  // }

  return (
    <Center>
      <Box w="100%">
        <Box>
          <FormControl>
            <FormLabel htmlFor="vaultProtoConfig">Vault Proto Config</FormLabel>
            <Input
              disabled={isLoading}
              required
              id="vaultProtoConfig"
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                try {
                  setProtoConfig(new PublicKey((e.target as HTMLInputElement).value));
                } catch (e) {
                  setProtoConfig(undefined);
                  console.error(e);
                }
              }}
              value={protoConfig?.toBase58() || ''}
              placeholder="Vault Proto Config"
            />
            <FormHelperText>Copy and paste the proto config publickey.</FormHelperText>

            <Box mt="10px" />

            <FormLabel htmlFor="tokenAMint">Token A Mint</FormLabel>
            <Input
              disabled={isLoading}
              required
              id="tokenAMint"
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                try {
                  setTokenAMint(new PublicKey((e.target as HTMLInputElement).value));
                } catch (e) {
                  setTokenAMint(undefined);
                  console.error(e);
                }
              }}
              value={tokenAMint?.toBase58() || ''}
              placeholder="Token A Mint"
            />
            <FormHelperText>Copy and paste the token mint publickey.</FormHelperText>

            <Box mt="10px" />

            <FormLabel htmlFor="tokenBMint">Token B Mint</FormLabel>
            <Input
              disabled={isLoading}
              required
              id="tokenBMint"
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                try {
                  setTokenBMint(new PublicKey((e.target as HTMLInputElement).value));
                } catch (e) {
                  setTokenBMint(undefined);
                  console.error(e);
                }
              }}
              value={tokenBMint?.toBase58() || ''}
              placeholder="Token B Mint"
            />
            <FormHelperText>Copy and paste the token mint publickey.</FormHelperText>

            <Box mt="10px" />

            <FormLabel htmlFor="treasuryAccount">Vault Proto Config</FormLabel>
            <InputGroup>
              <Input
                disabled={isLoading}
                id="treasuryAccount"
                onChange={(e: React.FormEvent<HTMLInputElement>) => {
                  try {
                    setProtoConfig(new PublicKey((e.target as HTMLInputElement).value));
                  } catch (e) {
                    setProtoConfig(undefined);
                    console.error(e);
                  }
                }}
                value={treasuryAccount?.toBase58() || ''}
                placeholder="Treasury Token B Account"
              />
              <InputRightElement>
                <Button onClick={createOrGetTreasuryAccount}>Fetch ATA</Button>
              </InputRightElement>
            </InputGroup>

            <FormHelperText>
              Copy and paste the treasury token accountpublickey.
              <br />
              If undefined, an ATA will be fetched/created.
            </FormHelperText>
          </FormControl>
        </Box>
        {/* <Box mt="10px"></Box> */}
        {/* <Box mt="10px"></Box> */}
        <Box mt="10px">
          <Button w="100%" onClick={deployVault}>
            Deploy Vault
          </Button>
        </Box>
      </Box>
    </Center>
  );
};
