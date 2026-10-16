import type { FC } from "react";

import { FormInput } from "../FormInput";

interface FormTextProps {
  className?: string;
}

const FormText: FC<FormTextProps> = ({ className }) => {
  return <FormInput className={className} />;
};

export { FormText };
