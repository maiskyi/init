import cn from 'classnames';
import { type FC } from 'react';

import { Toggle, type ToggleProps } from '../../Toggle';
import { FormController, type FormControllerProps } from '../FormController';
import { type FormToggleValidation } from './FormToggle.types';

import styles from '../Form.module.scss';

interface FormToggleProps
  extends Omit<
      FormControllerProps<string, FormToggleValidation>,
      'children' | 'type'
    >,
    Omit<ToggleProps, 'onChange' | 'value'> {}

const FormToggle: FC<FormToggleProps> = ({
  className,
  name,
  validation,
  label,
  errors,
  description,
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
        <Toggle
          className={cn(
            styles.toggle,
            {
              [`${styles.invalid}`]: invalid,
            },
            className,
          )}
          description={description}
          id={id}
          invalid={invalid}
          onChange={onChange}
          value={value}
        />
      )}
    </FormController>
  );
};

export { FormToggle };
