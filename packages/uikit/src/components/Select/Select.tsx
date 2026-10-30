import cn from 'classnames';
import isEqual from 'lodash.isequal';
import { Fragment, type ReactElement } from 'react';

import { Dropdown } from '../Dropdown';
import { SelectContext } from './Select.context';
import {
  type SelectGetOptionLabelFunction,
  type SelectGetOptionValueFunction,
  type SelectSize,
} from './Select.type';
import { SelectInput } from './SelectInput';

import styles from './Select.module.scss';

export interface SelectProps<T extends object, V = string> {
  className?: string;
  disabled?: boolean;
  getOptionLabel: SelectGetOptionLabelFunction<T>;
  getOptionValue: SelectGetOptionValueFunction<T, V>;
  invalid?: boolean;
  onChange?: (value: NoInfer<V>) => void;
  options?: T[];
  placeholder?: string;
  size?: SelectSize;
  value?: V;
}

interface SelectComponent {
  <T extends object, V = string>(props: SelectProps<T, V>): ReactElement;
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
    const isActive = !!value && isEqual(optionValue, value);
    const optionLabel = getOptionLabel({ isActive, option });
    return {
      isActive,
      label: optionLabel,
      value: optionValue,
    };
  });

  const selectedOption = options.find(({ isActive }) => isActive);

  const handleOnChange: NonNullable<typeof onChange> = (value) => {
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
          <Dropdown.Header>
            {placeholder || <Fragment>&nbsp;</Fragment>}
          </Dropdown.Header>
          <Dropdown.Menu>
            {options.map(({ label, value: optionValue, isActive }, index) => {
              return (
                <Dropdown.MenuItem
                  active={isActive}
                  // Option values are unconstrained, so no value-derived key
                  // is reliably unique: an object value stringifies to
                  // "[object Object]" for every option. Menu items hold no
                  // state, so keying by position is safe here.
                  // biome-ignore lint/suspicious/noArrayIndexKey: explained above
                  key={index}
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
