import cn from 'classnames';
import type { FC } from 'react';

import { Input } from '../../Input';
import { FormController, type FormControllerProps } from '../FormController';
import type { FormTextValidation } from './FormText.types';

import styles from '../Form.module.scss';

interface FormTextProps
  extends Omit<
    FormControllerProps<string, FormTextValidation>,
    'children' | 'type'
  > {
  type?: 'text' | 'search' | 'email' | 'url';
  placeholder?: string;
  className?: string;
}

const FormText: FC<FormTextProps> = ({
  className,
  name,
  placeholder,
  type = 'text',
  validation,
  label,
}) => {
  return (
    <FormController<string>
      name={name}
      type="text"
      validation={validation}
      label={label}
    >
      {({ id, value = '', invalid, onBlur, onChange }) => (
        <Input
          id={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={cn(
            styles.input,
            {
              [`${styles.invalid}`]: invalid,
            },
            className,
          )}
          invalid={invalid}
          placeholder={placeholder}
          type={type}
        />
      )}
    </FormController>
  );
};

export { FormText };
