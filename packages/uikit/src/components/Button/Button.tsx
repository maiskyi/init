import cn from 'classnames';
import { forwardRef, type PropsWithChildren } from 'react';

import { Icon, type IconName } from '../Icon';
import {
  type ButtonSize,
  type ButtonType,
  type ButtonVariant,
} from './Button.types';

import styles from './Button.module.scss';

type ButtonProps = PropsWithChildren<{
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
  isPending?: boolean;
  type?: ButtonType;
  icon?: IconName;
}>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      onClick,
      className,
      disabled,
      size = 'medium',
      variant = 'tertiary',
      isPending = false,
      type,
      children,
      icon,
    },
    ref,
  ) => {
    const handleOnClick = () => {
      if (isPending) return;
      onClick?.();
    };

    return (
      <button
        className={cn(
          styles.button,
          styles[size],
          styles[variant],
          {
            [`${styles.pending}`]: isPending,
            [`${styles['icon-only']}`]: icon && !children,
          },
          className,
        )}
        disabled={disabled}
        onClick={handleOnClick}
        ref={ref}
        type={type}
      >
        <span className={styles.content}>
          {icon && <Icon name={icon} />}
          {children}
        </span>
      </button>
    );
  },
);

export type { ButtonProps };
export { Button };
