import { PaymentMethodIcon } from '@rockethash/uikit';
import cn from 'classnames';
import { type FC } from 'react';

import {
  PAYMENT_METHOD_ICONS_BY_NAME,
  PAYMENT_METHOD_LABELS,
} from './WalletPaymentMethodOption.const';

import styles from './WalletPaymentMethodOption.module.scss';

interface WalletPaymentMethodOptionProps {
  isActive: boolean;
  name: string;
}

const WalletPaymentMethodOption: FC<WalletPaymentMethodOptionProps> = ({
  isActive,
  name,
}) => {
  const iconName = PAYMENT_METHOD_ICONS_BY_NAME[name];

  return (
    <span className={styles['payment-method-option']}>
      <span className={styles['payment-method-option__icon']}>
        {iconName && <PaymentMethodIcon name={iconName} size={30} />}
      </span>
      <span
        className={cn(styles['payment-method-option__label'], {
          [`${styles['payment-method-option__label_active']}`]: isActive,
        })}
      >
        {PAYMENT_METHOD_LABELS[name] ?? name}
      </span>
    </span>
  );
};

export { WalletPaymentMethodOption, type WalletPaymentMethodOptionProps };
