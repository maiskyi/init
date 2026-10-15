import type { ChangeEventHandler, ReactElement, ReactNode } from "react";

export interface SelectProps<T extends object> {
  options: T[];
  value: string | number;
  onChange: (value: string | number) => void;
  getOptionValue: (option: T) => string | number;
  getOptionLabel: (option: T) => ReactNode;
}

interface SelectComponent {
  <T extends object>(props: SelectProps<T>): ReactElement;
}

export const Select: SelectComponent = ({
  options,
  value,
  getOptionValue,
  getOptionLabel,
  onChange,
}) => {
  const handleOnChange: ChangeEventHandler<
    HTMLSelectElement,
    HTMLSelectElement
  > = (event) => {
    onChange(event.target.value);
  };

  return (
    <select value={value} onChange={handleOnChange}>
      {options.map((option) => (
        <option key={getOptionValue(option)} value={getOptionValue(option)}>
          {getOptionLabel(option)}
        </option>
      ))}
    </select>
  );
};
