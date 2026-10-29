import { useContext } from 'react';

import { WalletDataProviderContext } from './WalletDataProvider.context';

const useWalletData = () => useContext(WalletDataProviderContext);

export { useWalletData };
