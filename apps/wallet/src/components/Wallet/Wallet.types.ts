export enum WalletScreen {
  Home = 'home',
  Swap = 'swap',
  Vault = 'vault',
  DepositCrypto = 'deposit-crypto',
  BuyCrypto = 'buy-crypto',
  DepositFiat = 'deposit-fiat',
  Withdraw = 'withdraw',
}

export interface WalletRef {
  back: () => void;
}
