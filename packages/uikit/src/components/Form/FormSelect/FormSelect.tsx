import cn from 'classnames';
import { type ReactElement } from 'react';

import { Select, type SelectProps } from '../../Select';
import { FormController, type FormControllerProps } from '../FormController';
import { type FormSelectValidation } from './FormSelect.types';

import styles from '../Form.module.scss';

interface FormSelectProps<T extends object>
  extends SelectProps<T>,
    Omit<
      FormControllerProps<string, FormSelectValidation>,
      'children' | 'type'
    > {}

interface FormSelectComponent {
  <T extends object>(props: FormSelectProps<T>): ReactElement;
}

const FormSelect: FormSelectComponent = ({
  className,
  name,
  placeholder,
  validation,
  label,
  getOptionLabel,
  getOptionValue,
  options,
}) => {
  return (
    <FormController<string>
      label={label}
      name={name}
      type="select"
      validation={validation}
    >
      {({ value = '', invalid, onChange }) => (
        <Select
          className={cn(
            styles.select,
            {
              [`${styles.invalid}`]: invalid,
            },
            className,
          )}
          getOptionLabel={getOptionLabel}
          getOptionValue={getOptionValue}
          invalid={invalid}
          onChange={onChange}
          options={options}
          placeholder={placeholder}
          value={value}
        />
      )}
    </FormController>
  );
};

export type { FormSelectProps };
export { FormSelect };
