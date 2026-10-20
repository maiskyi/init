import { createContext } from "react";

interface FormContextProps {
  submit: (
    e?: React.BaseSyntheticEvent<object, unknown, unknown> | undefined,
  ) => Promise<unknown>;
}

export const FormContext = createContext<FormContextProps>({
  submit: () => Promise.resolve(),
});
