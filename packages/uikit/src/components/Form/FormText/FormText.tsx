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
  className?: string;
  placeholder?: string;
  type?: 'text' | 'search' | 'email' | 'url';
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
      label={label}
      name={name}
      type="text"
      validation={validation}
    >
      {({ id, value = '', invalid, onBlur, onChange }) => (
        <Input
          className={cn(
            styles.input,
            {
              [`${styles.invalid}`]: invalid,
            },
            className,
          )}
          id={id}
          invalid={invalid}
          onBlur={onBlur}
          onChange={onChange}
          placeholder={placeholder}
          type={type}
          value={value}
        />
      )}
    </FormController>
  );
};

export { FormText };
