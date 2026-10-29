export interface WalletDepositCryptoProps {
  className?: string;
}

export enum WalletDepositCryptoFormFields {
  Balance = 'balance',
  PaymentMethod = 'paymentMethod',
}

export interface WalletDepositCryptoForm {
  [WalletDepositCryptoFormFields.Balance]: string;
  [WalletDepositCryptoFormFields.PaymentMethod]: string;
}
