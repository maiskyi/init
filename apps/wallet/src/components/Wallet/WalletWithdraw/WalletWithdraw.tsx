import { type FC } from 'react';

import { type WalletWithdrawProps } from './WalletWithdraw.types';

const WalletWithdraw: FC<WalletWithdrawProps> = ({ className }) => {
  return <div className={className}>WalletWithdraw</div>;
};

export type { WalletWithdrawProps };
export { WalletWithdraw };
