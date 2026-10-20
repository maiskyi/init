import type { ChangeEventHandler, ReactElement, ReactNode } from 'react';

export interface SelectProps<T extends object> {
  getOptionLabel: (option: T) => ReactNode;
  getOptionValue: (option: T) => string | number;
  onChange: (value: string | number) => void;
  options: T[];
  value: string | number;
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
    <select onChange={handleOnChange} value={value}>
      {options.map((option) => (
        <option key={getOptionValue(option)} value={getOptionValue(option)}>
          {getOptionLabel(option)}
        </option>
      ))}
    </select>
  );
};
