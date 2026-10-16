import cn from "classnames";
import type { FC, PropsWithChildren } from "react";

import styles from "../Form.module.scss";

type FormHintProps = PropsWithChildren<{
  className?: string;
}>;

const FormHint: FC<FormHintProps> = ({ children, className }) => {
  return <div className={cn(styles.hint, className)}>{children}</div>;
};

export { FormHint };
