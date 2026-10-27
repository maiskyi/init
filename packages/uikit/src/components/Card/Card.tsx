import cn from 'classnames';
import { type FC, type PropsWithChildren } from 'react';

import { type CardGlow } from './Card.types';

import styles from './Card.module.scss';

type CardProps = PropsWithChildren<{
  className?: string;
  outline?: boolean;
  onClick?: () => void;
  glow?: CardGlow;
}>;

const Card: FC<CardProps> = ({
  className,
  children,
  outline = false,
  onClick,
  glow = 'none',
}) => {
  const handleOnClick = () => {
    onClick?.();
  };

  return (
    <div
      className={cn(
        styles.card,
        styles[glow],
        {
          [`${styles.outline}`]: outline,
          [`${styles.clickable}`]: !!onClick,
          [`${styles.glow}`]: glow !== 'none',
        },
        className,
      )}
      onClick={handleOnClick}
    >
      {children}
    </div>
  );
};

export type { CardProps };
export { Card };
