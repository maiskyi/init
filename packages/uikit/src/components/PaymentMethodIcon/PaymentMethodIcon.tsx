import { type FC } from 'react';

import { PAYMENT_METHOD_ICONS } from './PaymentMethodIcon.const';
import { type PaymentMethodIconName } from './PaymentMethodIcon.types';

interface PaymentMethodIconProps {
  className?: string;
  name: PaymentMethodIconName;
  size?: number;
}

const PaymentMethodIcon: FC<PaymentMethodIconProps> = ({
  className,
  name,
  size = 24,
}) => {
  const Icon = PAYMENT_METHOD_ICONS[name];

  if (!Icon) return null;

  return <Icon className={className} height={size} width={size} />;
};

export type { PaymentMethodIconProps };
export { PaymentMethodIcon };
