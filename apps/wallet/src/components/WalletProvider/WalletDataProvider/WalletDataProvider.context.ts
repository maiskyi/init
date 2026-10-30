import { type DTO } from '@services/api';
import { createContext } from 'react';

interface WalletPaymentMethod {
  currencies: Record<string, boolean>;
  name: string;
}

interface WalletDataProviderContextProps {
  cryptoCurrencies: DTO.Currency[];
  fiatCurrencies: DTO.Currency[];
  paymentMethods: WalletPaymentMethod[];
  userBalances: DTO.UserBalances;
}

const WalletDataProviderContext = createContext<WalletDataProviderContextProps>(
  {
    cryptoCurrencies: [],
    fiatCurrencies: [],
    paymentMethods: [],
    userBalances: {},
  },
);

export { WalletDataProviderContext };
