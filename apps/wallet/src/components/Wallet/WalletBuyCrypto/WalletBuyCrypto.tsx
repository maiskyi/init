import { type FC } from 'react';

import { type WalletBuyCryptoProps } from './WalletBuyCrypto.types';

const WalletBuyCrypto: FC<WalletBuyCryptoProps> = ({ className }) => {
  return <div className={className}>WalletBuyCrypto</div>;
};

export type { WalletBuyCryptoProps };
export { WalletBuyCrypto };
