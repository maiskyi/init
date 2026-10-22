import { type FC } from 'react';

import { PAYMENT_METHOD_ICONS } from './PaymentMethodIcon.const';
import { type PaymentMethodName } from './PaymentMethodIcon.types';

interface PaymentMethodIconProps {
  className?: string;
  name: PaymentMethodName;
  size?: number;
}

const PaymentMethodIcon: FC<PaymentMethodIconProps> = ({
  className,
  name,
  size = 24,
}) => {
  const Icon = PAYMENT_METHOD_ICONS[name];

  return <Icon className={className} height={size} width={size} />;
};

export type { PaymentMethodIconProps };
export { PaymentMethodIcon };
