import cn from "classnames";
import type { FC, PropsWithChildren } from "react";

import styles from "../Form.module.scss";

type FormInputGroupProps = PropsWithChildren<{
  className?: string;
}>;

const FormInputGroup: FC<FormInputGroupProps> = ({ children, className }) => {
  return <div className={cn(styles.inputGroup, className)}>{children}</div>;
};

export { FormInputGroup };
