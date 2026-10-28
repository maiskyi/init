import { type FC } from 'react';

interface WalletVaultProps {
  className?: string;
}

const WalletVault: FC<WalletVaultProps> = ({ className }) => {
  return <div className={className}>WalletVault</div>;
};

export type { WalletVaultProps };
export { WalletVault };
