import cn from 'classnames';
import { type ReactElement, type ReactNode } from 'react';

import { Dropdown } from '../Dropdown';
import { SelectContext } from './Select.context';
import {
  type SelectGetOptionLabelFunction,
  type SelectGetOptionValueFunction,
  type SelectSize,
} from './Select.type';
import { SelectInput } from './SelectInput';

import styles from './Select.module.scss';

export interface SelectProps<T extends object> {
  className?: string;
  disabled?: boolean;
  getOptionLabel: SelectGetOptionLabelFunction<T>;
  getOptionValue: SelectGetOptionValueFunction<T>;
  invalid?: boolean;
  onChange?: (value: string | number) => void;
  options?: T[];
  placeholder?: string;
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
  placeholder,
  invalid = false,
}) => {
  const options = initialOptions.map((option) => {
    const optionValue = getOptionValue({ option });
    const isActive = !!value && optionValue === value;
    const optionLabel = getOptionLabel({ isActive, option });
    return {
      isActive,
      label: optionLabel,
      value: optionValue,
    };
  });

  const selectedOption = options.find(
    ({ value: optionValue }) => optionValue === value,
  );

  const handleOnChange = (value: string | number) => {
    onChange?.(value);
  };

  return (
    <SelectContext.Provider value={{ value }}>
      <Dropdown placement="bottom-left">
        <Dropdown.Toggle>
          <SelectInput
            className={className}
            disabled={disabled}
            invalid={invalid}
            size={size}
          >
            {selectedOption ? (
              selectedOption.label
            ) : (
              <span className={styles.placeholder}>{placeholder}</span>
            )}
          </SelectInput>
        </Dropdown.Toggle>
        <Dropdown.Content
          className={cn(styles.content, styles[size])}
          matchToggleWidth
        >
          <Dropdown.Menu>
            {options.map(({ label, value: optionValue, isActive }) => {
              return (
                <Dropdown.MenuItem
                  active={isActive}
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
