import cn from "classnames";
import type { FC } from "react";

import { Input } from "../../Input";
import { FormController } from "../FormController";

import styles from "../Form.module.scss";

interface FormTextProps {
  className?: string;
  name: string;
}

const FormText: FC<FormTextProps> = ({ className, name }) => {
  return (
    <FormController<string> name={name}>
      {({ id, value = "", invalid, onBlur, onChange }) => (
        <Input
          id={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={cn(styles.input, className)}
          invalid={invalid}
        />
      )}
    </FormController>
  );
};

export { FormText };
