import { useContext } from 'react';

import { WalletContext } from './Wallet.context';

const useWallet = () => {
  const context = useContext(WalletContext);

  return context;
};

export { useWallet };
