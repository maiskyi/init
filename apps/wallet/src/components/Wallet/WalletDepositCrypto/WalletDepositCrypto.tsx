import { type FC } from 'react';

import { type WalletDepositCryptoProps } from './WalletDepositCrypto.types';

const WalletDepositCrypto: FC<WalletDepositCryptoProps> = ({ className }) => {
  return <div className={className}>WalletDepositCrypto</div>;
};

export type { WalletDepositCryptoProps };
export { WalletDepositCrypto };
