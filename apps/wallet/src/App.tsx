import { Button, ThemeProvider } from '@rockethash/uikit';
import { useRef, useState } from 'react';

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
    screen: WalletScreen.Home,
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
          <Button
            icon="chevron-left"
            onClick={handleOnBackClick}
            variant="secondary"
          />
        )}
      </div>
      <ThemeProvider>
        <WalletProvider>
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
