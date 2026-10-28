import { Alert, Grid } from '@rockethash/uikit';
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
  type OnScreenChangeHandler,
  type WalletRef,
  WalletScreen,
  type WalletScreenState,
  type WalletState,
} from './Wallet.types';

export interface WalletProps {
  initialScreen?: WalletScreen;
  onScreenChange?: OnScreenChangeHandler;
  onSupportClick?: () => void;
}

export const Wallet = forwardRef<WalletRef, WalletProps>(
  (
    { initialScreen = WalletScreen.Home, onScreenChange, onSupportClick },
    ref,
  ) => {
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
      setScreen: setActiveScreen,
    }));

    return (
      <WalletContext.Provider value={contextValue}>
        <Grid spacing={3}>
          <Grid.Cell>
            <Screen {...screen.props} />
          </Grid.Cell>
          {onSupportClick && (
            <Grid.Cell>
              <Alert onClick={onSupportClick} variant="info">
                Have questions? Feel free to write us any time
              </Alert>
            </Grid.Cell>
          )}
        </Grid>
      </WalletContext.Provider>
    );
  },
);
