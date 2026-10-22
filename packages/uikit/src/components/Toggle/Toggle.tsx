import cn from 'classnames';
import { type ChangeEventHandler, type FC } from 'react';

import styles from './Toggle.module.scss';

interface ToggleProps {
  className?: string;
  description?: string;
  disabled?: boolean;
  id?: string;
  invalid?: boolean;
  onChange?: (value: boolean) => void;
  value?: boolean;
}

const Toggle: FC<ToggleProps> = ({
  className,
  value,
  onChange,
  disabled = false,
  id,
  description,
  invalid = false,
}) => {
  const handleOnChange: ChangeEventHandler<
    HTMLInputElement,
    HTMLInputElement
  > = (event) => {
    onChange?.(event.target.checked);
  };

  return (
    <div
      className={cn(
        styles.container,
        {
          [`${styles.invalid}`]: invalid,
        },
        className,
      )}
    >
      <label className={styles.toggle}>
        <input
          checked={value}
          className={styles.input}
          disabled={disabled}
          id={id}
          onChange={handleOnChange}
          type="checkbox"
        />

        <span className={styles.track}>
          <span className={styles.thumb} />
        </span>
      </label>
      {description && <span className={styles.label}>{description}</span>}
    </div>
  );
};

export type { ToggleProps };
export { Toggle };
