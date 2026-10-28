import { type FC } from 'react';

import { type WalletSwapProps } from './WalletSwap.types';

const WalletSwap: FC<WalletSwapProps> = ({ className }) => {
  return <div className={className}>WalletSwap</div>;
};

export type { WalletSwapProps };
export { WalletSwap };
