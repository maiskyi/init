import type { PropsWithChildren, ReactElement } from "react";
import { type FieldValues, FormProvider, useForm } from "react-hook-form";

import { FormContext } from "./Form.context";
import { FormSubmit } from "./FormSubmit";
import { FormText } from "./FormText";

type FormProps<T extends FieldValues> = PropsWithChildren<{
  onSubmit: (data: T) => void | Promise<void>;
}>;

interface FormCompoundedComponent {
  <T extends FieldValues = FieldValues>(props: FormProps<T>): ReactElement;
  Text: typeof FormText;
  Submit: typeof FormSubmit;
}

const Form: FormCompoundedComponent = ({ children, onSubmit }) => {
  const methods = useForm();

  const submit = methods.handleSubmit(onSubmit);

  return (
    <FormContext.Provider value={{ submit }}>
      <FormProvider {...methods}>{children}</FormProvider>
    </FormContext.Provider>
  );
};

Form.Text = FormText;
Form.Submit = FormSubmit;

export { Form };
