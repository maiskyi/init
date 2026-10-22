import { type FC } from 'react';

import { FIAT_ICONS } from './FiatIcon.const';
import { type FiatIconName } from './FiatIcon.types';

interface FiatIconProps {
  className?: string;
  name: FiatIconName;
  size?: number;
}

const FiatIcon: FC<FiatIconProps> = ({ className, name, size = 24 }) => {
  const Icon = FIAT_ICONS[name];

  return <Icon className={className} height={size} width={size} />;
};

export type { FiatIconProps };
export { FiatIcon };
