import cn from 'classnames';
import {
  type ChangeEventHandler,
  type FC,
  type PropsWithChildren,
  useId,
} from 'react';

import styles from './Checkbox.module.scss';

type CheckboxProps = PropsWithChildren<{
  className?: string;
  disabled?: boolean;
  id?: string;
  invalid?: boolean;
  onChange?: (value: boolean) => void;
  value?: boolean;
}>;

const Checkbox: FC<CheckboxProps> = ({
  className,
  disabled = false,
  id: initialId,
  invalid = false,
  onChange,
  value,
  children,
}) => {
  const id = useId();

  const resolvedId = initialId ?? id;

  const handleOnChange: ChangeEventHandler<
    HTMLInputElement,
    HTMLInputElement
  > = (event) => {
    onChange?.(event.target.checked);
  };

  return (
    <div
      className={cn(
        styles.checkbox,
        {
          [`${styles.disabled}`]: disabled,
          [`${styles.invalid}`]: invalid,
        },
        className,
      )}
    >
      <label className={styles.input}>
        <input
          checked={value}
          disabled={disabled}
          id={resolvedId}
          onChange={handleOnChange}
          type="checkbox"
        />
      </label>
      {children && (
        <label className={styles.label} htmlFor={resolvedId}>
          {children}
        </label>
      )}
    </div>
  );
};

export type { CheckboxProps };
export { Checkbox };
