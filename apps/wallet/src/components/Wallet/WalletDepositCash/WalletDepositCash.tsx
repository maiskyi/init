import { type FC } from 'react';

interface WalletDepositCashProps {
  className?: string;
}

const WalletDepositCash: FC<WalletDepositCashProps> = ({ className }) => {
  return <div className={className}>WalletDepositCash</div>;
};

export type { WalletDepositCashProps };
export { WalletDepositCash };
