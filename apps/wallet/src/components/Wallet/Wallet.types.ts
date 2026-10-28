import { type WalletBuyCryptoProps } from './WalletBuyCrypto/WalletBuyCrypto.types';
import { type WalletDepositCashProps } from './WalletDepositCash/WalletDepositCash.types';
import { type WalletDepositCryptoProps } from './WalletDepositCrypto/WalletDepositCrypto.types';
import { type WalletHomeProps } from './WalletHome/WalletHome.types';
import { type WalletSwapProps } from './WalletSwap/WalletSwap.types';
import { type WalletVaultProps } from './WalletVault/WalletVault.types';
import { type WalletWithdrawProps } from './WalletWithdraw/WalletWithdraw.types';

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
