import { type ReactElement, useId } from "react";
import { Controller } from "react-hook-form";

import type { FormControlChildren } from "./FormController.types";

interface FormControllerProps<T> {
  name: string;
  children: FormControlChildren<T>;
}

interface FormControllerComponent {
  <T>(props: FormControllerProps<T>): ReactElement;
}

const FormController: FormControllerComponent = ({ name, children }) => {
  const id = useId();

  return (
    <Controller
      name={name}
      render={({
        field: { onBlur, onChange, value },
        fieldState: { invalid },
        formState: { errors },
      }) =>
        children({
          id,
          value,
          invalid,
          onBlur,
          onChange,
        })
      }
    />
  );
};

export { FormController };
