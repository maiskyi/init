export interface WalletBuyCryptoProps {
  className?: string;
}

export enum WalletBuyCryptoFormFields {
  Balance = 'balance',
  PaymentMethod = 'paymentMethod',
}

export interface WalletBuyCryptoForm {
  [WalletBuyCryptoFormFields.Balance]: string;
  [WalletBuyCryptoFormFields.PaymentMethod]: string;
}
