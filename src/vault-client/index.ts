import { Address, BN, Program, Provider } from '@project-serum/anchor';
import { DcaVault } from '../idl/type';
import DcaVaultIDL from '../idl/idl.json';
import { DcaGranularity, InitTxResult } from './types';
import { Keypair, SystemProgram } from '@solana/web3.js';
import invariant from 'tiny-invariant';

export class VaultClient {
  public readonly program: Program<DcaVault>;

  public constructor(vaultProgramId: Address, provider?: Provider) {
    this.program = new Program(DcaVaultIDL as DcaVault, vaultProgramId, provider);
  }

  public async initVaultProtoConfig(granularity: DcaGranularity): Promise<InitTxResult> {
    const vaultProtoConfigKeypair = Keypair.generate();

    invariant(this.program.provider, 'Provider is null');

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
