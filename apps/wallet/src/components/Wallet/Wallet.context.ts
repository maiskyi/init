import { createContext } from 'react';

import { WalletScreen } from './Wallet.types';

interface WalletContextProps {
  screen: WalletScreen;
}

export const WalletContext = createContext<WalletContextProps>({
  screen: WalletScreen.Home,
});
