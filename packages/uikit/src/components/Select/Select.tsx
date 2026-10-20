import cn from 'classnames';
import {
  type ChangeEventHandler,
  type ReactElement,
  type ReactNode,
} from 'react';

import { SelectContext } from './Select.context';
import { type SelectSize } from './Select.type';

import styles from './Select.module.scss';

export interface SelectProps<T extends object> {
  disabled?: boolean;
  getOptionLabel: (option: T) => ReactNode;
  getOptionValue: (option: T) => string | number;
  onChange?: (value: string | number) => void;
  options: T[];
  size?: SelectSize;
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
  disabled = false,
  size = 'medium',
}) => {
  const handleOnChange: ChangeEventHandler<
    HTMLSelectElement,
    HTMLSelectElement
  > = (event) => {
    onChange?.(event.target.value);
  };

  return (
    <SelectContext.Provider value={{ value }}>
      <select
        className={cn(styles.select, styles[size])}
        disabled={disabled}
        onChange={handleOnChange}
        value={value}
      >
        {options.map((option) => (
          <option key={getOptionValue(option)} value={getOptionValue(option)}>
            {getOptionLabel(option)}
          </option>
        ))}
      </select>
    </SelectContext.Provider>
  );
};
