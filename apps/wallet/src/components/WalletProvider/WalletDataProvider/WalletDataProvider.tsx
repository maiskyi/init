import { COMMON_DATA, COMMON_USER_DATA } from '@services/api';
import { type FC, type PropsWithChildren } from 'react';

import { EXCLUDED_FIAT_CURRENCIES } from './WalletDataProvider.const';
import { WalletDataProviderContext } from './WalletDataProvider.context';

type WalletDataProviderProps = PropsWithChildren<{
  children: React.ReactNode;
}>;

const WalletDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const cryptoCurrencies = COMMON_DATA.currencies.filter(
    (currency) => !currency.isFiat && currency.hasDeposit,
  );

  const fiatCurrencies = COMMON_DATA.currencies.filter(
    (currency) =>
      currency.isFiat &&
      currency.hasDeposit &&
      !(currency.symbol in EXCLUDED_FIAT_CURRENCIES),
  );

  const userBalances = COMMON_USER_DATA.userBalances;

  return (
    <WalletDataProviderContext.Provider
      value={{ cryptoCurrencies, fiatCurrencies, userBalances }}
    >
      {children}
    </WalletDataProviderContext.Provider>
  );
};

export { WalletDataProvider, type WalletDataProviderProps };
