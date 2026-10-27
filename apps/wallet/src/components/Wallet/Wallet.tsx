import { type FC, forwardRef, useImperativeHandle } from 'react';

import { WalletContext } from './Wallet.context';
import { type WalletRef, WalletScreen } from './Wallet.types';

export interface WalletProps {
  initialScreen?: WalletScreen;
}

export const Wallet: FC<WalletProps> = forwardRef<WalletRef, WalletProps>(
  ({ initialScreen = WalletScreen.Home }, ref) => {
    useImperativeHandle(ref, () => ({
      back: () => {
        console.log('back');
      },
    }));

    return (
      <WalletContext.Provider value={{ screen: initialScreen }}>
        <div>Wallet</div>
      </WalletContext.Provider>
    );
  },
);
