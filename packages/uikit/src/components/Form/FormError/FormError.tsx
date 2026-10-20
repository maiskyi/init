import { ErrorMessage } from '@hookform/error-message';
import { type FC } from 'react';
import { type FieldErrors, type FieldValues } from 'react-hook-form';

import { FormHint } from '../FormHint';

interface FormErrorProps {
  errors: FieldErrors<FieldValues>;
  name: string;
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
