import { WalletScreen } from './components/Wallet';

export const WALLET_SCREENS_TITLES: Record<WalletScreen, string> = {
  [WalletScreen.Home]: 'Home',
  [WalletScreen.DepositCrypto]: 'Deposit Crypto',
  [WalletScreen.DepositCash]: 'Deposit Cash',
  [WalletScreen.BuyCrypto]: 'Buy Crypto',
  [WalletScreen.Swap]: 'Swap',
  [WalletScreen.Vault]: 'Vault',
  [WalletScreen.Withdraw]: 'Withdraw',
};
