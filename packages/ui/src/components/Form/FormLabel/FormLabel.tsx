import cn from "classnames";
import type { FC, PropsWithChildren } from "react";

import styles from "../Form.module.scss";

type FormLabelProps = PropsWithChildren<{
  className?: string;
  htmlFor?: string;
}>;

const FormLabel: FC<FormLabelProps> = ({ children, className, htmlFor }) => {
  return (
    <label className={cn(styles.label, className)} htmlFor={htmlFor}>
      {children}
    </label>
  );
};

export { FormLabel };
