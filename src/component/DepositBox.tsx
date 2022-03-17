import { Button } from '@chakra-ui/react';
import { FC } from 'react';
import styled from 'styled-components';
import { useVaultClient } from '../hooks/VaultClient';
import { DcaGranularity } from '../vault-client/types';

// TODO: Finalize the border-shadow on this
const Container = styled.div`
  padding: 20px;
  height: 600px;
  width: 500px;
  background: #101010;
  border-radius: 60px;
  box-shadow: 0 0 128px 1px rgba(98, 170, 255, 0.15);
`;

export const DepositBox: FC = () => {
  const vaultClient = useVaultClient();

  async function handleInitVaultProtoConfig() {
    console.log('Running initVaultProtoConfig');
    const result = await vaultClient.initVaultProtoConfig(DcaGranularity.Hourly);
    console.log('Init Vault Proto Config', {
      vaultProtoConfig: result.publicKey.toBase58(),
      txHash: result.txHash
    });
  }

  return (
    <Container>
      <Button onClick={handleInitVaultProtoConfig}>Init Vault Proto Config</Button>
    </Container>
  );
};
