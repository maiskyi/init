import type { PropsWithChildren, ReactElement } from "react";
import { type FieldValues, FormProvider, useForm } from "react-hook-form";

import { FormContext } from "./Form.context";
import { FormAddon } from "./FormAddon";
import { FormGroup } from "./FormGroup";
import { FormInputGroup } from "./FormInputGroup";
import { FormLabel } from "./FormLabel";
import { FormSubmit } from "./FormSubmit";
import { FormText } from "./FormText";

type FormProps<T extends FieldValues> = PropsWithChildren<{
  onSubmit: (data: T) => void | Promise<void>;
  defaultValues?: T;
}>;

interface FormCompoundedComponent {
  <T extends FieldValues = FieldValues>(props: FormProps<T>): ReactElement;
  Text: typeof FormText;
  Submit: typeof FormSubmit;
  Label: typeof FormLabel;
  Group: typeof FormGroup;
  InputGroup: typeof FormInputGroup;
  Addon: typeof FormAddon;
}

const Form: FormCompoundedComponent = ({
  children,
  onSubmit,
  defaultValues,
}) => {
  const methods = useForm({
    defaultValues,
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

export { Form };
