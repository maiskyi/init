import { type FC } from 'react';

import { type WalletDepositCashProps } from './WalletDepositCash.types';

const WalletDepositCash: FC<WalletDepositCashProps> = ({ className }) => {
  return <div className={className}>WalletDepositCash</div>;
};

export type { WalletDepositCashProps };
export { WalletDepositCash };
