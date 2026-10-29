import { ApiProvider, type ApiProviderProps } from '@services/api';
import { type FC } from 'react';

interface WalletProviderProps extends ApiProviderProps {}

const WalletProvider: FC<WalletProviderProps> = ({ children, apiBaseUrl }) => {
  return <ApiProvider apiBaseUrl={apiBaseUrl}>{children}</ApiProvider>;
};

export type { WalletProviderProps };
export { WalletProvider };
