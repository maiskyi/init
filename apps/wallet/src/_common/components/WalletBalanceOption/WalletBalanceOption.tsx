import { type DTO } from '@services/api';
import { type FC } from 'react';

interface WalletBalanceOptionProps {
  isActive: boolean;
  option: DTO.Currency;
}

const WalletBalanceOption: FC<WalletBalanceOptionProps> = ({
  isActive,
  option,
}) => {
  const { name } = option;
  return <div>{name}</div>;
};

export { WalletBalanceOption };
