import { type FC, type PropsWithChildren } from 'react';

import { COMMON_DATA } from './WalletDataProvider.const';
import { WalletDataProviderContext } from './WalletDataProvider.context';

type WalletDataProviderProps = PropsWithChildren<{
  children: React.ReactNode;
}>;

const WalletDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const cryptoCurrencies = COMMON_DATA.currencies.filter(
    (currency) => !currency.isFiat && !currency.isInternal,
  );

  const fiatCurrencies = COMMON_DATA.currencies.filter(
    (currency) => currency.isFiat && !currency.isInternal,
  );

  console.log(cryptoCurrencies, fiatCurrencies);

  return (
    <WalletDataProviderContext.Provider
      value={{ cryptoCurrencies, fiatCurrencies }}
    >
      {children}
    </WalletDataProviderContext.Provider>
  );
};

export { WalletDataProvider, type WalletDataProviderProps };
