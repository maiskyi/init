import cn from "classnames";
import type { FC, PropsWithChildren } from "react";
import styles from "./Button.module.scss";

export type ButtonProps = PropsWithChildren<{
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}>;

export const Button: FC<ButtonProps> = ({
  children,
  onClick,
  className,
  disabled,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(styles.button, className)}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
