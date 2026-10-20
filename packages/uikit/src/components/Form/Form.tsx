import { type PropsWithChildren, type ReactElement } from 'react';
import {
  type DefaultValues,
  type FieldValues,
  FormProvider,
  useForm,
} from 'react-hook-form';

import { FormContext } from './Form.context';
import { FormAddon } from './FormAddon';
import { FormGroup } from './FormGroup';
import { FormHint } from './FormHint';
import { FormInputGroup } from './FormInputGroup';
import { FormLabel } from './FormLabel';
import { FormSubmit } from './FormSubmit';
import { FormText } from './FormText';

type FormProps<T extends FieldValues> = PropsWithChildren<{
  onSubmit: (data: T) => void | Promise<void>;
  defaultValues?: T;
}>;

interface FormCompoundedComponent {
  Addon: typeof FormAddon;
  Group: typeof FormGroup;
  Hint: typeof FormHint;
  InputGroup: typeof FormInputGroup;
  Label: typeof FormLabel;
  Submit: typeof FormSubmit;
  Text: typeof FormText;
  <T extends FieldValues = FieldValues>(props: FormProps<T>): ReactElement;
}

const Form: FormCompoundedComponent = ({
  children,
  onSubmit,
  defaultValues,
}) => {
  const methods = useForm({
    defaultValues: defaultValues as DefaultValues<typeof defaultValues>,
  });

  const submit = methods.handleSubmit(onSubmit);

  return (
    <FormContext.Provider value={{ submit }}>
      <FormProvider {...methods}>{children}</FormProvider>
    </FormContext.Provider>
  );
};

Form.Text = FormText;
Form.Submit = FormSubmit;
Form.Label = FormLabel;
Form.Group = FormGroup;
Form.InputGroup = FormInputGroup;
Form.Addon = FormAddon;
Form.Hint = FormHint;

export { Form };
