import cn from "classnames";
import { forwardRef, type PropsWithChildren } from "react";
import styles from "./Button.module.scss";
import type { ButtonSize, ButtonVariant } from "./Button.types";

export type ButtonProps = PropsWithChildren<{
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
}>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      onClick,
      className,
      disabled,
      size = "medium",
      variant = "tertiary",
    },
    ref,
  ) => {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(styles.button, styles[size], styles[variant], className)}
        disabled={disabled}
        ref={ref}
      >
        {children}
      </button>
    );
  },
);
