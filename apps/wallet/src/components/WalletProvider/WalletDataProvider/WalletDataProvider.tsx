import {
  CASHIER_INFO_DATA,
  COMMON_DATA,
  COMMON_USER_DATA,
} from '@services/api';
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

  const paymentMethods = CASHIER_INFO_DATA.deposit.availableMethods.map(
    (paymentMethod) => {
      return {
        currencies: paymentMethod.currencies.reduce((acc, currency) => {
          return { ...acc, [currency]: currency };
        }, {}),
        name: paymentMethod.name,
      };
    },
  );

  return (
    <WalletDataProviderContext.Provider
      value={{ cryptoCurrencies, fiatCurrencies, paymentMethods, userBalances }}
    >
      {children}
    </WalletDataProviderContext.Provider>
  );
};

export { WalletDataProvider, type WalletDataProviderProps };
