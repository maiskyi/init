import { type FC } from 'react';

interface WalletDepositCryptoProps {
  className?: string;
}

const WalletDepositCrypto: FC<WalletDepositCryptoProps> = ({ className }) => {
  return <div className={className}>WalletDepositCrypto</div>;
};

export type { WalletDepositCryptoProps };
export { WalletDepositCrypto };
