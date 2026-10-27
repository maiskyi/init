import { ThemeProvider } from '@rockethash/uikit';

import { Wallet } from './components/Wallet';
import { WalletProvider } from './components/WalletProvider';

import styles from './App.module.scss';

export const App = () => {
  return (
    <div className={styles.root}>
      <ThemeProvider>
        <WalletProvider>
          <Wallet />
        </WalletProvider>
      </ThemeProvider>
    </div>
  );
};
