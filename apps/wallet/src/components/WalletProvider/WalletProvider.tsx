import { ApiProvider, type ApiProviderProps } from '@services/api';
import { type FC } from 'react';

import { WalletDataProvider } from './WalletDataProvider';

interface WalletProviderProps extends ApiProviderProps {}

const WalletProvider: FC<WalletProviderProps> = ({ children, apiBaseUrl }) => {
  return (
    <ApiProvider apiBaseUrl={apiBaseUrl}>
      <WalletDataProvider>{children}</WalletDataProvider>
    </ApiProvider>
  );
};

export type { WalletProviderProps };
export { WalletProvider };
