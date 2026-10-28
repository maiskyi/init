import { type FC } from 'react';

interface WalletBuyCryptoProps {
  className?: string;
}

const WalletBuyCrypto: FC<WalletBuyCryptoProps> = ({ className }) => {
  return <div className={className}>WalletBuyCrypto</div>;
};

export type { WalletBuyCryptoProps };
export { WalletBuyCrypto };
