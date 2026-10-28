import { Button, ThemeProvider } from '@rockethash/uikit';
import { useRef, useState } from 'react';

import { Wallet, type WalletRef, WalletScreen } from './components/Wallet';
import { WalletProvider } from './components/WalletProvider';

import styles from './App.module.scss';

export const App = () => {
  const wallet = useRef<WalletRef>(null);

  const [{ screen }] = useState({
    screen: WalletScreen.Home,
  });

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Button
          icon="chevron-right"
          onClick={() => wallet.current?.back()}
          variant="secondary"
        />
      </div>
      <ThemeProvider>
        <WalletProvider>
          <Wallet initialScreen={screen} ref={wallet} />
        </WalletProvider>
      </ThemeProvider>
    </div>
  );
};
