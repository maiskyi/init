import cn from "classnames";
import { forwardRef, type HTMLInputTypeAttribute } from "react";

import styles from "./Input.module.scss";

interface InputProps {
  type?: HTMLInputTypeAttribute;
  value?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      value,
      disabled,
      id,
      name,
      placeholder,
      readOnly,
      className,
    },
    ref,
  ) => {
    return (
      <input
        type={type}
        value={value}
        //   defaultValue={defaultValue}
        disabled={disabled}
        id={id}
        //   maxLength={maxLength}
        //   minLength={minLength}
        name={name}
        placeholder={placeholder}
        readOnly={readOnly}
        className={cn(styles.input, className)}
        //   onChange={onChange}
        ref={ref}
        //   onBlur={onBlur}
        //   onFocus={onFocus}
        //   autoComplete={autoComplete}
        //   inputMode={inputMode}
        //   onKeyDown={onKeyDown}
      />
    );
  },
);

export { Input };
