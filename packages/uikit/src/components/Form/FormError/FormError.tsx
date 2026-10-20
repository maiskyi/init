import { ErrorMessage } from '@hookform/error-message';
import type { FC } from 'react';
import type { FieldErrors, FieldValues } from 'react-hook-form';

import { FormHint } from '../FormHint';

interface FormErrorProps {
  name: string;
  errors: FieldErrors<FieldValues>;
}

const FormError: FC<FormErrorProps> = ({ errors, name }) => {
  return (
    <ErrorMessage
      errors={errors}
      name={name}
      render={({ message }) => {
        return <FormHint invalid>{message}</FormHint>;
      }}
    />
  );
};

export { FormError };
