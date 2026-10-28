import { type FC } from 'react';

interface WalletWithdrawProps {
  className?: string;
}

const WalletWithdraw: FC<WalletWithdrawProps> = ({ className }) => {
  return <div className={className}>WalletWithdraw</div>;
};

export type { WalletWithdrawProps };
export { WalletWithdraw };
