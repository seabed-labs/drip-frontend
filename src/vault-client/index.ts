import { BN, Program, Provider } from '@project-serum/anchor';
import { DcaVault } from '../idl/type';
import DcaVaultIDL from '../idl/idl.json';
import { DcaGranularity, InitTxResult } from './types';
import { Keypair, SystemProgram } from '@solana/web3.js';
import { assertWalletConnected } from '../utils/wallet';

export class VaultClient {
  // TODO: Move this to an env var
  public static readonly ProgramID = '3Q1eJ9m3jYJ3F32gcJYL7gMPn9kj87MzzjgoAL7VSN6E';
  public readonly program: Program<DcaVault>;

  public constructor(provider: Provider) {
    this.program = new Program(DcaVaultIDL as DcaVault, VaultClient.ProgramID, provider);
  }

  public async initVaultProtoConfig(granularity: DcaGranularity): Promise<InitTxResult> {
    const vaultProtoConfigKeypair = Keypair.generate();

    assertWalletConnected(this.program.provider.wallet);

    const txHash = await this.program.rpc.initVaultProtoConfig(
      {
        granularity: new BN(granularity)
      },
      {
        accounts: {
          vaultProtoConfig: vaultProtoConfigKeypair.publicKey,
          creator: this.program.provider.wallet.publicKey,
          systemProgram: SystemProgram.programId
        },
        signers: [vaultProtoConfigKeypair]
      }
    );

    return {
      publicKey: vaultProtoConfigKeypair.publicKey,
      txHash
    };
  }
}
