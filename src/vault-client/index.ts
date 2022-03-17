import { Address, BN, Program, Provider } from '@project-serum/anchor';
import { DcaVault } from '../idl/type';
import DcaVaultIDL from '../idl/idl.json';
import { DcaGranularity, InitTxResult } from './types';
import { Keypair, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import { assertWalletConnected } from '../utils/wallet';
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';

const CONSTANT_SEEDS = {
  vault: 'dca-vault-v1',
  tokenAAccount: 'token_a_account',
  tokenBAccount: 'token_b_account',
  vaultPeriod: 'vault_period',
  userPosition: 'user_position'
};

function findPDA(programId: PublicKey, seeds: (Uint8Array | Buffer)[]) {
  const [publicKey, bump] = findProgramAddressSync(seeds, programId);
  return {
    publicKey,
    bump
  };
}

function getVaultPDA(
  vaultProgramId: PublicKey,
  tokenA: PublicKey,
  tokenB: PublicKey,
  protoConfig: PublicKey
) {
  return findPDA(vaultProgramId, [
    Buffer.from(CONSTANT_SEEDS.vault),
    tokenA.toBuffer(),
    tokenB.toBuffer(),
    protoConfig.toBuffer()
  ]);
}

function toPublicKey(address: Address): PublicKey {
  return new PublicKey(address.toString());
}

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

  public async initVault(
    tokenA: Address,
    tokenB: Address,
    protoConfig: Address
  ): Promise<InitTxResult> {
    assertWalletConnected(this.program.provider.wallet);

    const vaultPDA = getVaultPDA(
      this.program.programId,
      toPublicKey(tokenA),
      toPublicKey(tokenB),
      toPublicKey(protoConfig)
    );

    const [vaultTokenAAccount, vaultTokenBAccount] = await Promise.all([
      getAssociatedTokenAddress(
        toPublicKey(tokenA),
        vaultPDA.publicKey,
        true,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      ),
      getAssociatedTokenAddress(
        toPublicKey(tokenB),
        vaultPDA.publicKey,
        true,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      )
    ]);

    const accounts = {
      vault: vaultPDA.publicKey.toBase58(),
      vaultProtoConfig: protoConfig.toString(),
      tokenAMint: tokenA.toString(),
      tokenBMint: tokenB.toString(),
      tokenAAccount: vaultTokenAAccount.toBase58(),
      tokenBAccount: vaultTokenBAccount.toBase58(),
      creator: this.program.provider.wallet.publicKey.toBase58(),
      systemProgram: SystemProgram.programId.toBase58(),
      tokenProgram: TOKEN_PROGRAM_ID.toBase58(),
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID.toBase58(),
      rent: SYSVAR_RENT_PUBKEY.toBase58()
    };

    console.log('INIT VAULT ACCOUNTS:', accounts);

    const txHash = await this.program.rpc.initVault({
      accounts
    });

    return {
      publicKey: vaultPDA.publicKey,
      txHash
    };
  }
}
