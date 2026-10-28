import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';

import { WALLET_SCREENS } from './Wallet.const';
import { WalletContext } from './Wallet.context';
import {
  type OnScreenChangeParams,
  type WalletRef,
  WalletScreen,
  type WalletScreenState,
  type WalletState,
} from './Wallet.types';

export interface WalletProps {
  initialScreen?: WalletScreen;
  onScreenChange?: (params: OnScreenChangeParams) => void;
}

export const Wallet = forwardRef<WalletRef, WalletProps>(
  ({ initialScreen = WalletScreen.Home, onScreenChange }, ref) => {
    const [{ screen }, setState] = useState<WalletState>({
      screen: {
        name: initialScreen,
        props: {},
      },
    });

    const Screen = WALLET_SCREENS[screen.name];

    const setActiveScreen = useCallback(
      (screen: WalletScreenState) => {
        setState((prev) => ({ ...prev, screen }));
        onScreenChange?.(screen);
      },
      [onScreenChange],
    );

    const contextValue = useMemo(
      () => ({
        screen: screen.name,
        setActiveScreen,
      }),
      [screen.name, setActiveScreen],
    );

    useImperativeHandle(ref, () => ({
      back: () => {
        console.log('back');
      },
    }));

    return (
      <WalletContext.Provider value={contextValue}>
        <Screen {...screen.props} />
      </WalletContext.Provider>
    );
  },
);
