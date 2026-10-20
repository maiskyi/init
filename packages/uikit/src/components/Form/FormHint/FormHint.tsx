import cn from "classnames";
import type { FC, PropsWithChildren } from "react";

import styles from "../Form.module.scss";

type FormHintProps = PropsWithChildren<{
  className?: string;
  invalid?: boolean;
}>;

const FormHint: FC<FormHintProps> = ({ children, className, invalid }) => {
  return (
    <div
      className={cn(
        styles.hint,
        {
          [`${styles.invalid}`]: invalid,
        },
        className,
      )}
    >
      {children}
    </div>
  );
};

export { FormHint };
