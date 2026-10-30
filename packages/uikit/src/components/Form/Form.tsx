import {
  forwardRef,
  type PropsWithChildren,
  type ReactElement,
  useImperativeHandle,
} from 'react';
import {
  type DefaultValues,
  type FieldValues,
  FormProvider,
  useForm,
} from 'react-hook-form';

import { FormContext } from './Form.context';
import { type FormRef, type FormRefSetValueMethod } from './Form.types';
import { FormAddon } from './FormAddon';
import { FormCheckbox } from './FormCheckbox';
import { FormGroup } from './FormGroup';
import { FormHint } from './FormHint';
import { FormInputGroup } from './FormInputGroup';
import { FormLabel } from './FormLabel';
import { FormNumber } from './FormNumber';
import { FormSelect } from './FormSelect';
import { FormSubmit } from './FormSubmit';
import { FormText } from './FormText';
import { FormToggle } from './FormToggle';

type FormProps<T extends FieldValues = FieldValues> = PropsWithChildren<{
  onSubmit: (data: T) => void | Promise<void>;
  defaultValues?: T;
}>;

interface FormCompoundedComponent {
  Addon: typeof FormAddon;
  Checkbox: typeof FormCheckbox;
  Group: typeof FormGroup;
  Hint: typeof FormHint;
  InputGroup: typeof FormInputGroup;
  Label: typeof FormLabel;
  Number: typeof FormNumber;
  Select: typeof FormSelect;
  Submit: typeof FormSubmit;
  Text: typeof FormText;
  Toggle: typeof FormToggle;
  <T extends FieldValues = FieldValues>(props: FormProps<T>): ReactElement;
}

const Form = forwardRef<FormRef, FormProps>(function Form(
  { children, onSubmit, defaultValues },
  ref,
) {
  const methods = useForm({
    defaultValues: defaultValues as DefaultValues<typeof defaultValues>,
  });

  const submit = methods.handleSubmit(onSubmit);

  const setValue: FormRefSetValueMethod<typeof defaultValues> = ({
    name,
    value,
  }) => {
    methods.setValue(name, value);
  };

  useImperativeHandle(ref, () => ({
    setValue,
  }));

  return (
    <FormContext.Provider value={{ submit }}>
      <FormProvider {...methods}>{children}</FormProvider>
    </FormContext.Provider>
  );
}) as unknown as FormCompoundedComponent;

Form.Text = FormText;
Form.Submit = FormSubmit;
Form.Label = FormLabel;
Form.Group = FormGroup;
Form.InputGroup = FormInputGroup;
Form.Addon = FormAddon;
Form.Hint = FormHint;
Form.Select = FormSelect;
Form.Toggle = FormToggle;
Form.Checkbox = FormCheckbox;
Form.Number = FormNumber;

export { Form };
