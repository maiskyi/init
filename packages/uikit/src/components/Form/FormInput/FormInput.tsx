import cn from 'classnames';
import { forwardRef, type HTMLInputTypeAttribute } from 'react';

import styles from '../Form.module.scss';

interface FormInputProps {
  className?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  placeholder?: string;
  readOnly?: boolean;
  type?: HTMLInputTypeAttribute;
  value?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      type = 'text',
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
        className={cn(styles.input, className)}
        //   defaultValue={defaultValue}
        disabled={disabled}
        id={id}
        //   maxLength={maxLength}
        //   minLength={minLength}
        name={name}
        placeholder={placeholder}
        readOnly={readOnly}
        //   onChange={onChange}
        ref={ref}
        type={type}
        value={value}
        //   onBlur={onBlur}
        //   onFocus={onFocus}
        //   autoComplete={autoComplete}
        //   inputMode={inputMode}
        //   onKeyDown={onKeyDown}
      />
    );
  },
);

export { FormInput };
