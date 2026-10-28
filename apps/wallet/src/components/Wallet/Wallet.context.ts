import { createContext } from 'react';

import { WalletScreen, type WalletScreenState } from './Wallet.types';

interface WalletContextProps {
  screen: WalletScreen;
  setActiveScreen: (screen: WalletScreenState) => void;
}

export const WalletContext = createContext<WalletContextProps>({
  screen: WalletScreen.Home,
  setActiveScreen: () => {},
});
