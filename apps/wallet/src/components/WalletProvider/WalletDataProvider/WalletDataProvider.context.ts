import { type DTO } from '@services/api';
import { createContext } from 'react';

interface WalletDataProviderContextProps {
  cryptoCurrencies: DTO.Currency[];
  fiatCurrencies: DTO.Currency[];
  userBalances: DTO.UserBalances;
}

const WalletDataProviderContext = createContext<WalletDataProviderContextProps>(
  {
    cryptoCurrencies: [],
    fiatCurrencies: [],
    userBalances: {},
  },
);

export { WalletDataProviderContext };
