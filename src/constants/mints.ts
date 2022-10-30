import { Network } from '@dcaf-labs/drip-sdk';
import { TokenSymbol } from './symbol';

export const Mints: Record<Network, Record<TokenSymbol, string>> = {
  [Network.Mainnet]: {
    [TokenSymbol.BTC]: '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E',
    [TokenSymbol.SOL]: 'So11111111111111111111111111111111111111112',
    [TokenSymbol.wETH]: '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',
    [TokenSymbol.USDC]: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    [TokenSymbol.mSOL]: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
    [TokenSymbol.stSOL]: '7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj',
    [TokenSymbol.USDT]: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'
  },
  [Network.Devnet]: {
    [TokenSymbol.BTC]: 'BTC',
    [TokenSymbol.SOL]: 'So11111111111111111111111111111111111111112',
    [TokenSymbol.wETH]: 'WETH',
    [TokenSymbol.USDC]: 'USDC',
    [TokenSymbol.mSOL]: 'mSOL',
    [TokenSymbol.stSOL]: 'stSOL',
    [TokenSymbol.USDT]: 'USDT'
  },
  [Network.Localnet]: {
    [TokenSymbol.BTC]: 'BTC',
    [TokenSymbol.SOL]: 'So11111111111111111111111111111111111111112',
    [TokenSymbol.wETH]: 'WETH',
    [TokenSymbol.USDC]: 'USDC',
    [TokenSymbol.mSOL]: 'mSOL',
    [TokenSymbol.stSOL]: 'stSOL',
    [TokenSymbol.USDT]: 'USDT'
  }
};
