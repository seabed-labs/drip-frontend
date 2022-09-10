import { PublicKey } from '@solana/web3.js';

export function getProgramId(): PublicKey | undefined {
  const injectedProgramId = process.env.REACT_APP_PROGRAM_ID;
  if (injectedProgramId) {
    return new PublicKey(injectedProgramId);
  }
  return undefined;
}
