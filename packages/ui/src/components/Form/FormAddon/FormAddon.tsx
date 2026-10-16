import cn from "classnames";
import type { FC, PropsWithChildren } from "react";

import type { FormAddonPosition } from "./FormAddon.types";

import styles from "../Form.module.scss";

type FormAddonProps = PropsWithChildren<{
  className?: string;
  position: FormAddonPosition;
}>;

const FormAddon: FC<FormAddonProps> = ({ children, className, position }) => {
  return (
    <div
      className={cn(
        styles.addon,
        {
          [`${styles.before}`]: position === "before",
          [`${styles.after}`]: position === "after",
        },
        className,
      )}
    >
      {children}
    </div>
  );
};

export { FormAddon };
