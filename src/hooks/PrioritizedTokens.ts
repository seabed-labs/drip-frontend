import { Network, Token } from '@dcaf-labs/drip-sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import { useCallback, useMemo } from 'react';
import { Mints, TokenSymbol } from '../constants';
import { useNetwork } from '../contexts/NetworkContext';
import { useSolBalance } from './SolBalance';
import { TokenAccountSortOpt, useTokenAccounts } from './TokenAccounts';
import { useTokenMap } from './TokenInfoMap';

export interface PrioritizedTokens {
  bluechips: Token[];
  userTokens: Token[];
  otherTokens: Token[];
}

export interface PrioritizedTokenOpts {
  mints?: string[];
  filter?: string;
}

export function usePrioritizedTokens(
  { mints, filter }: PrioritizedTokenOpts = { mints: undefined, filter: undefined }
): PrioritizedTokens | undefined {
  const network = useNetwork();
  const tokenMap = useTokenMap();
  const wallet = useWallet();
  const tokenAccounts = useTokenAccounts(wallet.publicKey?.toBase58(), TOKEN_ACCOUNT_OPTS);

  const bluechips = useMemo(
    () =>
      BluechipMints[network].reduce((arr, mint) => {
        const token = tokenMap?.[mint];

        if (!token) {
          return arr;
        }

        arr.push(token);
        return arr;
      }, [] as Token[]),
    [tokenMap, network]
  );

  const solBalance = useSolBalance(wallet.publicKey?.toBase58());

  const userTokens = useMemo(() => {
    let tokens =
      tokenAccounts?.reduce((arr, tokenAccount) => {
        const token = tokenMap?.[tokenAccount.account.mint.toBase58()];

        if (token && tokenAccount.account.amount > BigInt(0)) {
          arr.push(token);
        }

        return arr;
      }, [] as Token[]) ?? [];

    const wsolToken = tokenMap?.[Mints[network][TokenSymbol.SOL]];
    if (wsolToken && solBalance && solBalance > BigInt(0)) {
      tokens = [wsolToken].concat(tokens);
    }

    return tokens;
  }, [tokenAccounts, solBalance, tokenMap, network]);

  const userTokenMap = useMemo(
    () =>
      userTokens?.reduce((map, token) => {
        map[token.mint.toBase58()] = true;
        return map;
      }, {} as Partial<Record<string, boolean>>),
    [userTokens]
  );

  const otherTokens = useMemo(
    () =>
      tokenMap &&
      Object.values(tokenMap)
        // NOTE: token is guaranteed to be non-null if you look at how it's created given we're using Object.values(...)
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .filter((token) => !userTokenMap?.[token!.mint.toBase58()])
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .map((token) => token!),
    [tokenMap, userTokenMap]
  );

  const mintMap = useMemo(
    () =>
      mints &&
      mints.reduce((map, mint) => {
        map[mint] = true;
        return map;
      }, {} as Partial<Record<string, boolean>>),
    [mints]
  );

  const filterTokens = useCallback(
    (token: Token) => {
      const isInMints = !mintMap || mintMap[token.mint.toBase58()];
      const matchesFilter =
        !filter ||
        token.mint.toBase58() === filter ||
        token.symbol?.toLowerCase().includes(filter.toLowerCase());

      return isInMints && matchesFilter;
    },
    [mintMap, filter]
  );

  return useMemo(
    () =>
      bluechips &&
      userTokens &&
      otherTokens && {
        bluechips: bluechips.filter(filterTokens),
        userTokens: userTokens.filter(filterTokens),
        otherTokens: otherTokens.filter(filterTokens)
      },
    [bluechips, userTokens, otherTokens, filterTokens]
  );
}

const BluechipMints: Record<Network, string[]> = {
  [Network.Mainnet]: [
    Mints[Network.Mainnet][TokenSymbol.SOL],
    Mints[Network.Mainnet][TokenSymbol.USDC],
    Mints[Network.Mainnet][TokenSymbol.BTC],
    Mints[Network.Mainnet][TokenSymbol.wETH],
    Mints[Network.Mainnet][TokenSymbol.mSOL],
    Mints[Network.Mainnet][TokenSymbol.stSOL],
    Mints[Network.Mainnet][TokenSymbol.USDT]
  ],
  [Network.Devnet]: [],
  [Network.Localnet]: []
};

const TOKEN_ACCOUNT_OPTS = {
  sort: TokenAccountSortOpt.DescByBalance
};
