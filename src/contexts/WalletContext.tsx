import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
  GlowWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { FC, ReactNode, useMemo } from 'react';
import {
  SolanaMobileWalletAdapter,
  createDefaultAuthorizationResultCache,
  createDefaultAddressSelector
} from '@solana-mobile/wallet-adapter-mobile';
import { useNetwork } from './NetworkContext';
import { getClusterApiUrl, toWalletAdapterNetwork } from '../models/Network';

export const WalletContext: FC<{ children: ReactNode }> = ({ children }) => {
  const network = useNetwork();

  const endpoint = useMemo(() => getClusterApiUrl(network), [network]);
  const walletAdapterNetwork = useMemo(() => toWalletAdapterNetwork(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter({ network }),
      new GlowWalletAdapter({ network: walletAdapterNetwork }),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network: walletAdapterNetwork }),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network: walletAdapterNetwork }),
      new SolletExtensionWalletAdapter({ network: walletAdapterNetwork }),
      new SolanaMobileWalletAdapter({
        addressSelector: createDefaultAddressSelector(),
        appIdentity: {},
        authorizationResultCache: createDefaultAuthorizationResultCache(),
        cluster: walletAdapterNetwork
      })
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
