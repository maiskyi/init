import { type DTO } from '@services/api';
import { type FC } from 'react';

const WalletBalanceOption: FC<DTO.Currency> = ({ name, symbol }) => {
  return <div>{name}</div>;
};

export { WalletBalanceOption };
