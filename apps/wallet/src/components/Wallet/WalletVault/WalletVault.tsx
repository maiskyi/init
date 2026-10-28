import { type FC } from 'react';

import { type WalletVaultProps } from './WalletVault.types';

const WalletVault: FC<WalletVaultProps> = ({ className }) => {
  return <div className={className}>WalletVault</div>;
};

export type { WalletVaultProps };
export { WalletVault };
