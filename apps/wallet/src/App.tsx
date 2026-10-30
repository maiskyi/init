import { Button, Heading, ThemeProvider } from '@rockethash/uikit';
import { Fragment, useRef, useState } from 'react';

import { WALLET_SCREENS_TITLES } from './App.const';
import {
  type OnScreenChangeHandler,
  Wallet,
  type WalletRef,
  WalletScreen,
} from './components/Wallet';
import { WalletProvider } from './components/WalletProvider';

import styles from './App.module.scss';

export const App = () => {
  const wallet = useRef<WalletRef>(null);

  const [{ screen }, setScreen] = useState({
    screen: WalletScreen.DepositCrypto,
  });

  const handleOnScreenChange: OnScreenChangeHandler = ({ name }) => {
    setScreen((prev) => ({ ...prev, screen: name }));
  };

  const handleOnSupportClick = () => {
    alert('Support');
  };

  const handleOnBackClick = () => {
    wallet.current?.setScreen({ name: WalletScreen.Home });
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        {screen !== WalletScreen.Home && (
          <Fragment>
            <Button
              icon="chevron-left"
              onClick={handleOnBackClick}
              variant="secondary"
            />
            <Heading as="h4" weight="semibold">
              {WALLET_SCREENS_TITLES[screen]}
            </Heading>
          </Fragment>
        )}
      </div>
      <ThemeProvider>
        <WalletProvider apiBaseUrl="">
          <Wallet
            initialScreen={screen}
            onScreenChange={handleOnScreenChange}
            onSupportClick={handleOnSupportClick}
            ref={wallet}
          />
        </WalletProvider>
      </ThemeProvider>
    </div>
  );
};
