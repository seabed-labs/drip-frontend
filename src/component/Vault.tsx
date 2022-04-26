export {};
/*
import { Box, Button, Center, Code, FormLabel, Input, Link, useToast } from '@chakra-ui/react';
import { PublicKey } from '@solana/web3.js';
import { FC, useState } from 'react';
import { useNetwork } from '../contexts/NetworkContext';
import { useVaultClient } from '../hooks/VaultClient';
import { solscanTxUrl } from '../utils/block-explorer';

export const Vault: FC = () => {
  const [tokenAMint, setTokenAMint] = useState<PublicKey>();
  const [tokenBMint, setTokenBMint] = useState<PublicKey>();
  const [protoConfig, setProtoConfig] = useState<PublicKey>();
  const toast = useToast();
  const network = useNetwork();
  const vaultClient = useVaultClient(network);

  async function handleInitVault() {
    if (!tokenAMint || !tokenBMint || !protoConfig) {
      return;
    }

    try {
      const result = await vaultClient.initVault(tokenAMint, tokenBMint, protoConfig);
      toast({
        title: 'Vault created',
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
    <Center>
      <Box w="100%">
        <Box>
          <FormLabel>Token A Mint</FormLabel>
          <Input
            onChange={(e) => {
              try {
                setTokenAMint(new PublicKey(e.target.value));
              } catch (e) {
                setTokenAMint(undefined);
                console.error(e);
              }
            }}
            value={tokenAMint?.toBase58() || ''}
            placeholder="Token A Mint"
          />
        </Box>
        <Box mt="10px">
          <FormLabel>Token B Mint</FormLabel>
          <Input
            onChange={(e) => {
              try {
                setTokenBMint(new PublicKey(e.target.value));
              } catch (e) {
                setTokenBMint(undefined);
                console.error(e);
              }
            }}
            value={tokenBMint?.toBase58() || ''}
            placeholder="Token B Mint"
          />
        </Box>
        <Box mt="10px">
          <FormLabel>Vault Proto Config</FormLabel>
          <Input
            onChange={(e) => {
              try {
                setProtoConfig(new PublicKey(e.target.value));
              } catch (e) {
                setProtoConfig(undefined);
                console.error(e);
              }
            }}
            value={protoConfig?.toBase58() || ''}
            placeholder="Vault Proto Config"
          />
        </Box>
        <Box mt="10px">
          <Button w="100%" onClick={handleInitVault}>
            Deploy Vault
          </Button>
        </Box>
      </Box>
    </Center>
  );
};
*/
