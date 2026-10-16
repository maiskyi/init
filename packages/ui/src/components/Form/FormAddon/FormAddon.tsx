import cn from "classnames";
import type { FC, PropsWithChildren } from "react";

import styles from "../Form.module.scss";

type FormAddonProps = PropsWithChildren<{
  className?: string;
}>;

const FormAddon: FC<FormAddonProps> = ({ children, className }) => {
  return <div className={cn(styles.addon, className)}>{children}</div>;
};

export { FormAddon };
