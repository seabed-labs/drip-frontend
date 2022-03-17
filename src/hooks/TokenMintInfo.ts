import { Address } from '@project-serum/anchor';
import { getMint, Mint } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { useNetwork } from '../contexts/NetworkContext';
import { useVaultClient } from './VaultClient';

export function useTokenMintInfo(mint?: Address): Mint | undefined {
  const network = useNetwork();
  const vaultClient = useVaultClient(network);
  const [mintInfo, setMintInfo] = useState<Mint>();

  useEffect(() => {
    (async () => {
      if (!mint) return;

      const mintInfo = await getMint(
        vaultClient.program.provider.connection,
        new PublicKey(mint.toString())
      );

      setMintInfo(mintInfo);
    })();
  }, [vaultClient, mint]);

  return mintInfo;
}
