import cn from 'classnames';
import {
  type ChangeEventHandler,
  forwardRef,
  type HTMLInputTypeAttribute,
} from 'react';

import styles from './Input.module.scss';

interface InputProps {
  className?: string;
  disabled?: boolean;
  id?: string;
  invalid?: boolean;
  name?: string;
  onBlur?: () => void;
  onChange?: ChangeEventHandler<HTMLInputElement, HTMLInputElement>;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  type?: HTMLInputTypeAttribute;
  value?: string;
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
      onValueChange,
    },
    ref,
  ) => {
    const handleOnChange: ChangeEventHandler<
      HTMLInputElement,
      HTMLInputElement
    > = (event) => {
      onChange?.(event);
      onValueChange?.(event.target.value);
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
        disabled={disabled}
        id={id}
        name={name}
        onBlur={onBlur}
        onChange={handleOnChange}
        placeholder={placeholder}
        readOnly={readOnly}
        ref={ref}
        type={type}
        value={value}
      />
    );
  },
);

export { Input };
