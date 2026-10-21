import cn from 'classnames';
import { type FC } from 'react';

import { type IconName } from './__generated__/rockethash';
import { type IconFontSize } from './Icon.types';

import './__generated__/rockethash.css';
import styles from './Icon.module.scss';

interface IconProps {
  className?: string;
  name: IconName;
  size?: IconFontSize;
}

const Icon: FC<IconProps> = ({ className, name, size }) => {
  return (
    <span
      className={cn(
        'icon',
        `icon-${name}`,
        styles.icon,
        {
          [`${styles.lg}`]: size === 'lg',
          [`${styles.md}`]: size === 'md',
          [`${styles.sm}`]: size === 'sm',
          [`${styles.xs}`]: size === 'xs',
        },
        className,
      )}
    />
  );
};

export type { IconProps };
export { Icon };
