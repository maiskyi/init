import type { FC, PropsWithChildren } from "react";

type FormGroupProps = PropsWithChildren<{
  label?: string;
}>;

const FormGroup: FC<FormGroupProps> = ({ children, label }) => {
  return (
    <div className="form-group">
      <label htmlFor={label}>{label}</label>
      {children}
    </div>
  );
};

export { FormGroup };
