import { type FC, useContext } from 'react';
import { useFormState } from 'react-hook-form';

import { Button, type ButtonProps } from '../../Button';
import { FormContext } from '../Form.context';

type FormSubmitProps = Omit<ButtonProps, 'type' | 'onClick'>;

const FormSubmit: FC<FormSubmitProps> = ({
  children,
  isPending = false,
  ...props
}) => {
  const { isSubmitting } = useFormState();

  const { submit } = useContext(FormContext);

  const isLoading = isSubmitting || isPending;

  return (
    <Button isPending={isLoading} onClick={submit} {...props}>
      {children}
    </Button>
  );
};

export { FormSubmit };
