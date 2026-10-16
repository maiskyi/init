import cn from "classnames";
import type { FC, PropsWithChildren } from "react";

import styles from "../Form.module.scss";

type FormLabelProps = PropsWithChildren<{
  className?: string;
  htmlFor?: string;
}>;

const FormLabel: FC<FormLabelProps> = ({ children, className, htmlFor }) => {
  if (typeof children === "string") {
    return (
      <label className={cn(styles.label, className)} htmlFor={htmlFor}>
        {children}
      </label>
    );
  }

  return <div className={cn(styles.label, className)}>{children}</div>;
};

export { FormLabel };
