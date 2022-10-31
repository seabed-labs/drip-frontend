import { Address } from '@project-serum/anchor';
import { Mints, TokenSymbol } from '../constants';
import { useNetwork } from '../contexts/NetworkContext';
import { useNetworkAddress } from './CurrentNetworkAddress';
import { useTokenBalance } from './TokenBalance';

export function useSolBalance(user?: Address): bigint | undefined {
  const network = useNetwork();
  const solAddr = useNetworkAddress(Mints[network][TokenSymbol.SOL]);
  const solBalance = useTokenBalance(user, solAddr);
  return solBalance && BigInt(solBalance.amount);
}
