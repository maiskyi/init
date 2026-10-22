import cn from 'classnames';
import {
  type ChangeEventHandler,
  type FC,
  type PropsWithChildren,
  useId,
} from 'react';

import styles from './Toggle.module.scss';

type ToggleProps = PropsWithChildren<{
  className?: string;
  disabled?: boolean;
  id?: string;
  invalid?: boolean;
  onChange?: (value: boolean) => void;
  value?: boolean;
}>;

const Toggle: FC<ToggleProps> = ({
  className,
  value,
  onChange,
  disabled = false,
  id: initialId,
  children,
  invalid = false,
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
          id={resolvedId}
          onChange={handleOnChange}
          type="checkbox"
        />

        <span className={styles.track}>
          <span className={styles.thumb} />
        </span>
      </label>
      {children && (
        <label className={styles.label} htmlFor={resolvedId}>
          {children}
        </label>
      )}
    </div>
  );
};

export type { ToggleProps };
export { Toggle };
