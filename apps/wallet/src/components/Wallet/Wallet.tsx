import { forwardRef, useImperativeHandle, useState } from 'react';

import { WalletContext } from './Wallet.context';
import { type WalletRef, WalletScreen } from './Wallet.types';
import { WalletHome } from './WalletHome';

export interface WalletProps {
  initialScreen?: WalletScreen;
}

export const Wallet = forwardRef<WalletRef, WalletProps>(
  ({ initialScreen = WalletScreen.Home }, ref) => {
    const [{ screen }] = useState({
      screen: initialScreen,
    });

    useImperativeHandle(ref, () => ({
      back: () => {
        console.log('back');
      },
    }));

    return (
      <WalletContext.Provider value={{ screen }}>
        <WalletHome />
      </WalletContext.Provider>
    );
  },
);
