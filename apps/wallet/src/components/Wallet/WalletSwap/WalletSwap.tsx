import { type FC } from 'react';

interface WalletSwapProps {
  className?: string;
}

const WalletSwap: FC<WalletSwapProps> = ({ className }) => {
  return <div className={className}>WalletSwap</div>;
};

export type { WalletSwapProps };
export { WalletSwap };
