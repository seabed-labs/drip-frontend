import { Address, BN, Program, Provider } from '@project-serum/anchor';
import { DcaVault } from '../idl/type';
import DcaVaultIDL from '../idl/idl.json';
import { InitTxResult } from './types';
import {
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction
} from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createApproveCheckedInstruction,
  getAccount,
  getAssociatedTokenAddress,
  getMint,
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

// function getVaultPDA(
//   vaultProgramId: PublicKey,
//   tokenA: PublicKey,
//   tokenB: PublicKey,
//   protoConfig: PublicKey
// ) {
//   return findPDA(vaultProgramId, [
//     Buffer.from(CONSTANT_SEEDS.vault),
//     tokenA.toBuffer(),
//     tokenB.toBuffer(),
//     protoConfig.toBuffer()
//   ]);
// }

export function getVaultPeriodPDA(vaultProgramId: PublicKey, vault: PublicKey, periodId: BN) {
  return findPDA(vaultProgramId, [
    Buffer.from(CONSTANT_SEEDS.vaultPeriod),
    vault.toBuffer(),
    Buffer.from(periodId.toString())
  ]);
}

function getPositionPDA(vaultProgramId: PublicKey, positionNftMint: PublicKey) {
  return findPDA(vaultProgramId, [
    Buffer.from(CONSTANT_SEEDS.userPosition),
    positionNftMint.toBuffer()
  ]);
}

function toPublicKey(address: Address): PublicKey {
  return new PublicKey(address.toString());
}

export class VaultClient {
  // TODO: Move this to an env var
  public static readonly ProgramID = 'AahZjZGD5Lv9HGPYUXZRS5GpeFFF13Wvx1fAFgwUxxDR';
  public readonly program: Program<DcaVault>;

  public constructor(provider: Provider) {
    this.program = new Program(DcaVaultIDL as DcaVault, VaultClient.ProgramID, provider);
  }

  // public async initVaultProtoConfig(granularity: DcaGranularity): Promise<InitTxResult> {
  //   const vaultProtoConfigKeypair = Keypair.generate();

  //   assertWalletConnected(this.program.provider.wallet);

  //   // const txHash = await this.program.rpc.initVaultProtoConfig(
  //   //   {
  //   //     granularity: new BN(granularity)
  //   //   },
  //   //   {
  //   //     accounts: {
  //   //       vaultProtoConfig: vaultProtoConfigKeypair.publicKey,
  //   //       creator: this.program.provider.wallet.publicKey,
  //   //       systemProgram: SystemProgram.programId
  //   //     },
  //   //     signers: [vaultProtoConfigKeypair]
  //   //   }
  //   // );

  //   return {
  //     publicKey: vaultProtoConfigKeypair.publicKey,
  //     txHash: ''
  //   };
  // }

  // public async initVault(
  //   tokenA: Address,
  //   tokenB: Address,
  //   protoConfig: Address
  // ): Promise<InitTxResult> {
  //   assertWalletConnected(this.program.provider.wallet);

  //   const vaultPDA = getVaultPDA(
  //     this.program.programId,
  //     toPublicKey(tokenA),
  //     toPublicKey(tokenB),
  //     toPublicKey(protoConfig)
  //   );

  //   const [vaultTokenAAccount, vaultTokenBAccount] = await Promise.all([
  //     getAssociatedTokenAddress(
  //       toPublicKey(tokenA),
  //       vaultPDA.publicKey,
  //       true,
  //       TOKEN_PROGRAM_ID,
  //       ASSOCIATED_TOKEN_PROGRAM_ID
  //     ),
  //     getAssociatedTokenAddress(
  //       toPublicKey(tokenB),
  //       vaultPDA.publicKey,
  //       true,
  //       TOKEN_PROGRAM_ID,
  //       ASSOCIATED_TOKEN_PROGRAM_ID
  //     )
  //   ]);

  //   // const accounts = {
  //   //   vault: vaultPDA.publicKey.toBase58(),
  //   //   vaultProtoConfig: protoConfig.toString(),
  //   //   tokenAMint: tokenA.toString(),
  //   //   tokenBMint: tokenB.toString(),
  //   //   tokenAAccount: vaultTokenAAccount.toBase58(),
  //   //   tokenBAccount: vaultTokenBAccount.toBase58(),
  //   //   creator: this.program.provider.wallet.publicKey.toBase58(),
  //   //   systemProgram: SystemProgram.programId.toBase58(),
  //   //   tokenProgram: TOKEN_PROGRAM_ID.toBase58(),
  //   //   associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID.toBase58(),
  //   //   rent: SYSVAR_RENT_PUBKEY.toBase58()
  //   // };

  //   // const txHash = await this.program.rpc.initVault({
  //   //   accounts
  //   // });

  //   return {
  //     publicKey: vaultPDA.publicKey,
  //     txHash: ''
  //   };
  // }

  public async deposit(
    vaultAddress: Address,
    amount: BN,
    numberOfCycles: BN
  ): Promise<InitTxResult> {
    // TODO: Account for token A being SOL here
    assertWalletConnected(this.program.provider.wallet);

    const vault = new PublicKey(vaultAddress);
    const vaultAccount = await this.program.account.vault.fetch(vault);
    const currentPeriodId = vaultAccount.lastDcaPeriod;
    const endPeriodId = currentPeriodId.add(numberOfCycles);
    const endPeriodPDA = getVaultPeriodPDA(this.program.programId, vault, endPeriodId);
    const endPeriodAccount = await this.program.account.vaultPeriod.fetchNullable(
      endPeriodPDA.publicKey
    );
    const userTokenAAccount = await getAssociatedTokenAddress(
      toPublicKey(vaultAccount.tokenAMint),
      this.program.provider.wallet.publicKey,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const tx = new Transaction({
      recentBlockhash: (await this.program.provider.connection.getLatestBlockhash()).blockhash,
      feePayer: this.program.provider.wallet.publicKey
    });

    if (!endPeriodAccount) {
      tx.add(
        this.program.instruction.initVaultPeriod(
          {
            periodId: endPeriodId
          },
          {
            accounts: {
              vault: vault,
              vaultPeriod: endPeriodPDA.publicKey,
              vaultProtoConfig: vaultAccount.protoConfig,
              tokenAMint: vaultAccount.tokenAMint,
              tokenBMint: vaultAccount.tokenBMint,
              creator: this.program.provider.wallet.publicKey,
              systemProgram: SystemProgram.programId
            }
          }
        )
      );
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const tokenAMintInfo = await getMint(this.program.provider.connection, vaultAccount.tokenAMint);

    tx.add(
      createApproveCheckedInstruction(
        userTokenAAccount,
        vaultAccount.tokenAMint,
        vault,
        this.program.provider.wallet.publicKey,
        BigInt(amount.toString()),
        tokenAMintInfo.decimals
      )
    );

    const positionNftMintKeypair = Keypair.generate();
    const userPositionPDA = getPositionPDA(
      this.program.programId,
      positionNftMintKeypair.publicKey
    );

    const userPositionNftAccount = await getAssociatedTokenAddress(
      positionNftMintKeypair.publicKey,
      this.program.provider.wallet.publicKey,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    tx.add(
      this.program.instruction.deposit(
        {
          tokenADepositAmount: amount,
          dcaCycles: numberOfCycles
        },
        {
          accounts: {
            vault,
            vaultPeriodEnd: endPeriodPDA.publicKey,
            userPosition: userPositionPDA.publicKey,
            tokenAMint: vaultAccount.tokenAMint,
            userPositionNftMint: positionNftMintKeypair.publicKey,
            vaultTokenAAccount: vaultAccount.tokenAAccount,
            userTokenAAccount,
            userPositionNftAccount,
            depositor: this.program.provider.wallet.publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            rent: SYSVAR_RENT_PUBKEY,
            systemProgram: SystemProgram.programId
          }
        }
      )
    );

    const txHash = await this.program.provider.send(tx, [positionNftMintKeypair]);

    return {
      publicKey: userPositionPDA.publicKey,
      txHash
    };
  }

  // public async withdrawB(vault: Address, position: Address): Promise<TxResult> {
  //   const vaultAccount = await this.program.account.vault.fetch(vault);
  //   const userPublicKey = this.program.provider.wallet.publicKey;
  //   const userTokenBAccount = await getAssociatedTokenAddress(
  //     toPublicKey(vaultAccount.tokenBMint),
  //     userPublicKey,
  //     true,
  //     TOKEN_PROGRAM_ID,
  //     ASSOCIATED_TOKEN_PROGRAM_ID
  //   );

  //   const userTokenBAccountInfo = await this.program.provider.connection.getAccountInfo(
  //     userTokenBAccount
  //   );

  //   const tx = new Transaction({
  //     recentBlockhash: (await this.program.provider.connection.getLatestBlockhash()).blockhash,
  //     feePayer: this.program.provider.wallet.publicKey
  //   });

  //   if (!userTokenBAccountInfo) {
  //     tx.add(
  //       createInitializeAccountInstruction(
  //         userTokenBAccount,
  //         vaultAccount.tokenBMint,
  //         userPublicKey
  //       )
  //     );
  //   }

  //   const userPositionAccount = await this.program.account.position.fetch(position);
  //   const { publicKey: vaultPeriodI } = getVaultPeriodPDA(
  //     this.program.programId,
  //     toPublicKey(vault),
  //     userPositionAccount.dcaPeriodIdBeforeDeposit
  //   );
  //   const { publicKey: vaultPeriodJ } = getVaultPeriodPDA(
  //     this.program.programId,
  //     toPublicKey(vault),
  //     userPositionAccount.dcaPeriodIdBeforeDeposit.add(userPositionAccount.numberOfSwaps)
  //   );

  //   const userPositionNftMint = userPositionAccount.positionAuthority;
  //   const userPositionNftAccount = await getAssociatedTokenAddress(
  //     userPositionNftMint,
  //     userPublicKey,
  //     true,
  //     TOKEN_PROGRAM_ID,
  //     ASSOCIATED_TOKEN_PROGRAM_ID
  //   );

  //   tx.add(
  //     this.program.instruction.withdrawB({
  //       accounts: {
  //         vault,
  //         vaultPeriodI,
  //         vaultPeriodJ,
  //         userPosition: userPositionAccount,
  //         userPositionNftAccount,
  //         userPositionNftMint,
  //         vaultTokenBAccount: vaultAccount.tokenBAccount,
  //         vaultTokenBMint: vaultAccount.tokenBMint,
  //         userTokenBAccount,
  //         withdrawer: userPublicKey,
  //         tokenProgram: TOKEN_PROGRAM_ID,
  //         associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID
  //       }
  //     })
  //   );

  //   // const txHash = await this.program.provider.send(tx);

  //   return {
  //     txHash: ''
  //   };
  // }

  // public async getUserPositions(): Promise<Record<string, unknown>> {
  //   assertWalletConnected(this.program.provider.wallet);

  //   const userPublicKey = this.program.provider.wallet.publicKey;

  //   const userTokenAccounts = await this.program.provider.connection.getParsedTokenAccountsByOwner(
  //     userPublicKey,
  //     {
  //       programId: TOKEN_PROGRAM_ID
  //     }
  //   );

  //   const userPossibleNftAccounts = userTokenAccounts.value.filter((tokenAccountData) => {
  //     const tokenAmount = tokenAccountData.account.data.parsed.info.tokenAmount.amount;
  //     return tokenAmount === '1';
  //   });

  //   const userPossibleNftMints: PublicKey[] = userPossibleNftAccounts.map((nftAccount) =>
  //     toPublicKey(nftAccount.account.data.parsed.info.mint)
  //   );

  //   const userPossiblePositionAccounts = userPossibleNftMints.map(
  //     (mintPublicKey) => getPositionPDA(this.program.programId, mintPublicKey).publicKey
  //   );

  //   const userPositionAccounts = await this.program.account.position.fetchMultiple(
  //     userPossiblePositionAccounts
  //   );

  //   return userPositionAccounts.reduce(
  //     (map, position, i) => ({
  //       ...map,
  //       ...(position ? { [userPossiblePositionAccounts[i].toBase58()]: position } : {})
  //     }),
  //     {} as Record<string, unknown>
  //   );
  // }

  public async getUserTokenBalance(tokenMint: string): Promise<BigInt | undefined> {
    assertWalletConnected(this.program.provider.wallet);

    const userPublicKey = this.program.provider.wallet.publicKey;

    const userTokenAccount = await getAssociatedTokenAddress(
      toPublicKey(tokenMint),
      userPublicKey,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const userTokenAccountInfo = await getAccount(
      this.program.provider.connection,
      userTokenAccount
    );
    return BigInt(userTokenAccountInfo.amount);
  }
}
