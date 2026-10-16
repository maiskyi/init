import cn from "classnames";
import type { FC } from "react";

import { Input } from "../../Input";

import styles from "../Form.module.scss";

interface FormTextProps {
  className?: string;
}

const FormText: FC<FormTextProps> = ({ className }) => {
  return <Input className={cn(styles.input, className)} />;
};

export { FormText };
