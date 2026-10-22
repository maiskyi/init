import { type FC } from 'react';

import { CRYPTO_ICONS } from './CryptoIcon.const';
import { type CryptoIconName } from './CryptoIcon.types';

interface CryptoIconProps {
  className?: string;
  name: CryptoIconName;
  size?: number;
}

const CryptoIcon: FC<CryptoIconProps> = ({ className, name, size = 24 }) => {
  const Icon = CRYPTO_ICONS[name];

  return <Icon className={className} height={size} width={size} />;
};

export type { CryptoIconProps };
export { CryptoIcon };
