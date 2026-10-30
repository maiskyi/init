export interface WalletDepositCashProps {
  className?: string;
}

export enum WalletDepositCashFormFields {
  Balance = 'balance',
  PaymentMethod = 'paymentMethod',
}

export interface WalletDepositCashForm {
  [WalletDepositCashFormFields.Balance]: string;
  [WalletDepositCashFormFields.PaymentMethod]: string;
}
