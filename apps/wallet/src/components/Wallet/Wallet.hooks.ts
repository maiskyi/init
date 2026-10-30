import { useContext } from 'react';
import { useLocalStorage } from 'react-use';

import { useWalletData } from '../WalletProvider';
import { WalletContext } from './Wallet.context';

const useWallet = () => {
  const context = useContext(WalletContext);

  return context;
};

const useWalletSettings = () => {
  const { cryptoCurrencies, paymentMethods } = useWalletData();

  const depositCryptoBalance = cryptoCurrencies[0].symbol;

  const depositCryptoPaymentMethod = paymentMethods
    .filter((paymentMethod) => paymentMethod.currencies[depositCryptoBalance])
    .at(0)?.name;

  return useLocalStorage('wallet:settings', {
    depositCrypto: {
      balance: depositCryptoBalance,
      paymentMethod: depositCryptoPaymentMethod,
    },
  });
};

export { useWallet, useWalletSettings };
