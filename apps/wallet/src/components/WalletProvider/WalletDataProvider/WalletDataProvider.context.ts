import { createContext } from 'react';

import { type Currency } from './WalletDataProvider.type';

interface WalletDataProviderContextProps {
  cryptoCurrencies: Currency[];
  fiatCurrencies: Currency[];
}

const WalletDataProviderContext = createContext<WalletDataProviderContextProps>(
  {
    cryptoCurrencies: [],
    fiatCurrencies: [],
  },
);

export { WalletDataProviderContext };
