import { Address, BN } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { useNetwork } from '../contexts/NetworkContext';
import { useVaultClient } from './VaultClient';

interface VaultInfo {
  tokenA: PublicKey;
  tokenB: PublicKey;
  lastDcaPeriod: BN;
}

export function useVaultInfo(vault: Address): VaultInfo | undefined {
  const network = useNetwork();
  const vaultClient = useVaultClient(network);
  const [vaultInfo, setVaultInfo] = useState<VaultInfo>();

  useEffect(() => {
    (async () => {
      const vaultAccount = await vaultClient.program.account.vault.fetch(vault);
      setVaultInfo({
        tokenA: new PublicKey(vaultAccount.tokenAMint),
        tokenB: new PublicKey(vaultAccount.tokenBMint),
        lastDcaPeriod: vaultAccount.lastDcaPeriod
      });
    })();
  }, [vaultClient, vault]);

  return vaultInfo;
}
