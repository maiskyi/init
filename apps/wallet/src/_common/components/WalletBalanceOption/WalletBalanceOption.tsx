import { CryptoIcon, type CryptoIconName } from '@rockethash/uikit';
import { type DTO } from '@services/api';
import cn from 'classnames';
import { type FC } from 'react';

import styles from './WalletBalanceOption.module.scss';

interface WalletBalanceOptionProps {
  isActive: boolean;
  option: DTO.Currency;
}

const BALANCE_PLACEHOLDER = '0.00';
const FIAT_BALANCE_PLACEHOLDER = '$0.00';

const WalletBalanceOption: FC<WalletBalanceOptionProps> = ({
  isActive,
  option,
}) => {
  const { name, symbol } = option;

  return (
    <span className={styles['balance-option']}>
      <span className={styles['balance-option__icon']}>
        <CryptoIcon name={symbol as CryptoIconName} size={20} />
      </span>
      <span className={styles['balance-option__label']}>
        <span
          className={cn(styles['balance-option__symbol'], {
            [`${styles['balance-option__symbol_active']}`]: isActive,
          })}
        >
          {symbol}
        </span>
        <span className={styles['balance-option__name']}>{name}</span>
      </span>
      <span className={styles['balance-option__balance']}>
        <span className={styles['balance-option__amount']}>
          {BALANCE_PLACEHOLDER}
        </span>
        <span className={styles['balance-option__fiat']}>
          {FIAT_BALANCE_PLACEHOLDER}
        </span>
      </span>
    </span>
  );
};

export type { WalletBalanceOptionProps };
export { WalletBalanceOption };
