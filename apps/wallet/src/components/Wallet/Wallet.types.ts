import { type WalletBuyCryptoProps } from './WalletBuyCrypto/WalletBuyCrypto';
import { type WalletDepositCashProps } from './WalletDepositCash';
import { type WalletDepositCryptoProps } from './WalletDepositCrypto';
import { type WalletHomeProps } from './WalletHome';
import { type WalletSwapProps } from './WalletSwap';
import { type WalletVaultProps } from './WalletVault';
import { type WalletWithdrawProps } from './WalletWithdraw';

export enum WalletScreen {
  Home = 'home',
  Swap = 'swap',
  Vault = 'vault',
  DepositCrypto = 'deposit-crypto',
  BuyCrypto = 'buy-crypto',
  DepositCash = 'deposit-cash',
  Withdraw = 'withdraw',
}

export interface WalletRef {
  back: () => void;
}

export type OnScreenChangeParams = WalletScreenState;

export type WalletScreenState =
  | {
      name: WalletScreen.Home;
      props: WalletHomeProps;
    }
  | {
      name: WalletScreen.Swap;
      props: WalletSwapProps;
    }
  | {
      name: WalletScreen.Vault;
      props: WalletVaultProps;
    }
  | {
      name: WalletScreen.DepositCrypto;
      props: WalletDepositCryptoProps;
    }
  | {
      name: WalletScreen.BuyCrypto;
      props: WalletBuyCryptoProps;
    }
  | {
      name: WalletScreen.DepositCash;
      props: WalletDepositCashProps;
    }
  | {
      name: WalletScreen.Withdraw;
      props: WalletWithdrawProps;
    };

export interface WalletState {
  screen: WalletScreenState;
}
