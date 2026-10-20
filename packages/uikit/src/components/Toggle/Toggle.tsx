import type { ChangeEventHandler, FC } from 'react';

import styles from './Toggle.module.scss';

interface ToggleProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
  id?: string;
}

const Toggle: FC<ToggleProps> = ({ value, onChange, disabled = false, id }) => {
  const handleOnChange: ChangeEventHandler<
    HTMLInputElement,
    HTMLInputElement
  > = (event) => {
    onChange?.(event.target.checked);
  };

  return (
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
  );
};

export { Toggle };
