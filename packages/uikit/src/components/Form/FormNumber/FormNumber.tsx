import cn from 'classnames';
import { type FC } from 'react';

import { Input } from '../../Input';
import { FormController, type FormControllerProps } from '../FormController';
import { type FormNumberValidation } from './FormNumber.types';

import styles from '../Form.module.scss';

interface FormNumberProps
  extends Omit<
    FormControllerProps<string, FormNumberValidation>,
    'children' | 'type'
  > {
  className?: string;
  placeholder?: string;
}

const FormNumber: FC<FormNumberProps> = ({
  className,
  name,
  placeholder,
  validation,
  label,
  errors,
}) => {
  return (
    <FormController<string | number>
      errors={errors}
      label={label}
      name={name}
      type="number"
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
          type="number"
          value={value ? `${value}` : undefined}
        />
      )}
    </FormController>
  );
};

export { FormNumber };
