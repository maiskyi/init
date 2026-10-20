import cn from 'classnames';
import { forwardRef, type PropsWithChildren } from 'react';

import { type ButtonSize, type ButtonVariant } from './Button.types';

import styles from './Button.module.scss';

type ButtonProps = PropsWithChildren<{
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
  isPending?: boolean;
  type?: 'button' | 'submit' | 'reset';
}>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      onClick,
      className,
      disabled,
      size = 'medium',
      variant = 'tertiary',
      isPending = false,
      type = 'button',
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
          },
          className,
        )}
        disabled={disabled}
        onClick={handleOnClick}
        ref={ref}
        type={type}
      >
        <span className={styles.content}>{children}</span>
      </button>
    );
  },
);

export type { ButtonProps };
export { Button };
