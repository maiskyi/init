import cn from 'classnames';
import {
  type ChangeEventHandler,
  forwardRef,
  type HTMLInputTypeAttribute,
} from 'react';

import styles from './Input.module.scss';

interface InputProps {
  type?: HTMLInputTypeAttribute;
  value?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
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
      onChange,
      onBlur,
      invalid,
    },
    ref,
  ) => {
    const handleOnChange: ChangeEventHandler<
      HTMLInputElement,
      HTMLInputElement
    > = (event) => {
      onChange?.(event.target.value);
    };

    return (
      <input
        className={cn(
          styles.input,
          {
            [`${styles.invalid}`]: invalid,
          },
          className,
        )}
        //   defaultValue={defaultValue}
        disabled={disabled}
        id={id}
        //   maxLength={maxLength}
        //   minLength={minLength}
        name={name}
        onBlur={onBlur}
        onChange={handleOnChange}
        placeholder={placeholder}
        readOnly={readOnly}
        ref={ref}
        type={type}
        value={value}
        //   onFocus={onFocus}
        //   autoComplete={autoComplete}
        //   inputMode={inputMode}
        //   onKeyDown={onKeyDown}
      />
    );
  },
);

export { Input };
