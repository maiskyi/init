import { WalletScreen } from './Wallet.types';
import { WalletBuyCrypto } from './WalletBuyCrypto';
import { WalletDepositCash } from './WalletDepositCash';
import { WalletDepositCrypto } from './WalletDepositCrypto';
import { WalletHome } from './WalletHome';
import { WalletSwap } from './WalletSwap';
import { WalletVault } from './WalletVault';
import { WalletWithdraw } from './WalletWithdraw';

export const WALLET_SCREENS = {
  [WalletScreen.BuyCrypto]: WalletBuyCrypto,
  [WalletScreen.DepositCash]: WalletDepositCash,
  [WalletScreen.DepositCrypto]: WalletDepositCrypto,
  [WalletScreen.Home]: WalletHome,
  [WalletScreen.Swap]: WalletSwap,
  [WalletScreen.Vault]: WalletVault,
  [WalletScreen.Withdraw]: WalletWithdraw,
};
