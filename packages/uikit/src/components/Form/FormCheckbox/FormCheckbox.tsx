import cn from 'classnames';
import { type FC } from 'react';

import { Checkbox, type CheckboxProps } from '../../Checkbox/Checkbox';
import { FormController, type FormControllerProps } from '../FormController';
import { type FormCheckboxValidation } from './FormCheckbox.types';

import styles from '../Form.module.scss';

interface FormCheckboxProps
  extends Omit<
      FormControllerProps<string, FormCheckboxValidation>,
      'children' | 'type'
    >,
    Omit<CheckboxProps, 'onChange' | 'value'> {}

const FormCheckbox: FC<FormCheckboxProps> = ({
  className,
  name,
  validation,
  label,
  errors,
  children,
}) => {
  return (
    <FormController<boolean>
      errors={errors}
      label={label}
      name={name}
      type="toggle"
      validation={validation}
    >
      {({ id, value = false, invalid, onChange }) => (
        <Checkbox
          className={cn(
            styles.checkbox,
            {
              [`${styles.invalid}`]: invalid,
            },
            className,
          )}
          id={id}
          invalid={invalid}
          onChange={onChange}
          value={value}
        >
          {children}
        </Checkbox>
      )}
    </FormController>
  );
};

export { FormCheckbox };
