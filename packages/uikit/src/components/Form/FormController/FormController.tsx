import { Fragment, type ReactElement, useId } from 'react';
import { Controller } from 'react-hook-form';

import { useFormControlRules } from '../Form.hooks';
import type { FormControlBaseValidation, FormControlType } from '../Form.types';
import { FormError } from '../FormError';
import type { FormControlChildren } from './FormController.types';

interface FormControllerProps<T, V extends FormControlBaseValidation> {
  label?: string;
  name: string;
  type: FormControlType;
  validation?: V;
  children: FormControlChildren<T>;
  errors?: Partial<Record<keyof V, string | string[]>>;
}

interface FormControllerComponent {
  <T>(props: FormControllerProps<T, FormControlBaseValidation>): ReactElement;
}

const FormController: FormControllerComponent = ({
  name,
  children,
  errors,
  label,
  type,
  validation,
}) => {
  const id = useId();

  console.log({
    errors,
    label,
    name,
    type,
    validation,
  });

  const { rules } = useFormControlRules({
    errors,
    label,
    name,
    type,
    validation,
  });

  return (
    <Controller
      name={name}
      render={({
        field: { onBlur, onChange, value },
        fieldState: { invalid },
        formState: { errors },
      }) => {
        return (
          <Fragment>
            {children({
              id,
              value,
              invalid,
              onBlur,
              onChange,
            })}
            <FormError errors={errors} name={name} />
          </Fragment>
        );
      }}
      rules={rules}
    />
  );
};

export type { FormControllerProps };
export { FormController };
