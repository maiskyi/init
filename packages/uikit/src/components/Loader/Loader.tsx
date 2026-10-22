import cn from 'classnames';
import { type FC } from 'react';

import { type LoaderVariant } from './Loader.types';

import styles from './Loader.module.scss';

interface LoaderProps {
  className?: string;
  variant?: LoaderVariant;
}

const Loader: FC<LoaderProps> = ({ className, variant = 'flashing-dots' }) => {
  return <div className={cn(styles.loader, styles[variant], className)} />;
};

export type { LoaderVariant };
export { Loader };
