import cn from 'classnames';
import { type ReactElement, type ReactNode } from 'react';

import { Dropdown } from '../Dropdown';
import { SelectContext } from './Select.context';
import { type SelectSize } from './Select.type';
import { SelectHolder } from './SelectHolder/SelectHolder';

import styles from './Select.module.scss';

export interface SelectProps<T extends object> {
  className?: string;
  disabled?: boolean;
  getOptionLabel: (option: T) => ReactNode;
  getOptionValue: (option: T) => string | number;
  onChange?: (value: string | number) => void;
  options?: T[];
  size?: SelectSize;
  value: string | number;
}

interface SelectComponent {
  <T extends object>(props: SelectProps<T>): ReactElement;
}

export const Select: SelectComponent = ({
  options: initialOptions = [],
  value,
  getOptionValue,
  getOptionLabel,
  onChange,
  disabled = false,
  size = 'medium',
  className,
}) => {
  const options = initialOptions.map((option) => ({
    label: getOptionLabel(option),
    option,
    value: getOptionValue(option),
  }));

  const selectedOption = options.find(
    ({ value: optionValue }) => optionValue === value,
  )?.option;

  const handleOnChange = (value: string | number) => {
    onChange?.(value);
  };

  return (
    <SelectContext.Provider value={{ value }}>
      <Dropdown placement="bottom-left">
        <Dropdown.Toggle>
          <SelectHolder className={className} disabled={disabled} size={size}>
            {selectedOption ? getOptionLabel(selectedOption) : ''}
          </SelectHolder>
        </Dropdown.Toggle>
        <Dropdown.Content className={cn(styles.content, styles[size])}>
          <Dropdown.Menu>
            {options.map(({ label, value: optionValue }) => {
              return (
                <Dropdown.MenuItem
                  active={value === optionValue}
                  key={optionValue}
                  onClick={() => handleOnChange(optionValue)}
                >
                  {label}
                </Dropdown.MenuItem>
              );
            })}
          </Dropdown.Menu>
        </Dropdown.Content>
      </Dropdown>
    </SelectContext.Provider>
  );
};
