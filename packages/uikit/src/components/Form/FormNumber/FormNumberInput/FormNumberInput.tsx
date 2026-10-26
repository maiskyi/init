import { type FC } from 'react';
import { NumericFormat, type OnValueChange } from 'react-number-format';

import { Input } from '../../../Input';
import { FORM_NUMBER_INPUT_DATA_TYPES_MAPPING } from './FormNumberInput.const';
import { type FormNumberInputDataType } from './FormNumberInput.types';

interface FormNumberInputProps {
  className?: string;
  dataType: FormNumberInputDataType;
  id?: string;
  invalid?: boolean;
  onBlur: () => void;
  onChange: (value: string | number) => void;
  placeholder?: string;
  value: string | number;
}

const FormNumberInput: FC<FormNumberInputProps> = ({
  className,
  invalid,
  placeholder,
  value,
  onChange,
  id,
  onBlur,
  dataType,
}) => {
  const handleOnValueChange: OnValueChange = (e) => {
    const key = FORM_NUMBER_INPUT_DATA_TYPES_MAPPING[dataType];
    onChange?.(e[key] ?? '');
  };

  return (
    <NumericFormat
      className={className}
      customInput={Input}
      id={id}
      //   displayType="text"
      invalid={invalid}
      onBlur={onBlur}
      onValueChange={handleOnValueChange}
      placeholder={placeholder}
      type="text"
      value={value}
    />
  );
};

export { FormNumberInput };
