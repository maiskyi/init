import cn from 'classnames';
import { type FC } from 'react';

import { FormController, type FormControllerProps } from '../FormController';
import { type FormNumberValidation } from './FormNumber.types';
import {
  FormNumberInput,
  type FormNumberInputDataType,
} from './FormNumberInput';

import styles from '../Form.module.scss';

interface FormNumberProps
  extends Omit<
    FormControllerProps<string, FormNumberValidation>,
    'children' | 'type'
  > {
  className?: string;
  dataType?: FormNumberInputDataType;
  placeholder?: string;
}

const FormNumber: FC<FormNumberProps> = ({
  className,
  name,
  placeholder,
  validation,
  label,
  errors,
  dataType = 'number',
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
        <FormNumberInput
          className={cn(
            styles.input,
            {
              [`${styles.invalid}`]: invalid,
            },
            className,
          )}
          dataType={dataType}
          id={id}
          invalid={invalid}
          onBlur={onBlur}
          onChange={onChange}
          placeholder={placeholder}
          value={value}
        />
      )}
    </FormController>
  );
};

export { FormNumber };
