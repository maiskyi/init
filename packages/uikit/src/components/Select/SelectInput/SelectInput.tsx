import cn from 'classnames';
import { type FC, forwardRef, type PropsWithChildren } from 'react';

import { Dropdown, useDropdown } from '../../Dropdown';
import { type SelectSize } from '../Select.type';

import styles from '../Select.module.scss';

type SelectInputProps = PropsWithChildren<{
  className?: string;
  disabled?: boolean;
  size: SelectSize;
  invalid?: boolean;
}>;

const SelectInput: FC<SelectInputProps> = forwardRef<
  HTMLDivElement,
  SelectInputProps
>(({ children, className, size, disabled = false, invalid = false }, ref) => {
  const { isOpen } = useDropdown();

  return (
    <div
      className={cn(
        styles.input,
        styles[size],
        {
          [`${styles.opened}`]: isOpen,
          [`${styles.disabled}`]: disabled,
          [`${styles.invalid}`]: invalid,
        },
        className,
      )}
      ref={ref}
    >
      {children}
      <Dropdown.ToggleArrow className={styles.arrow} />
    </div>
  );
});

export type { SelectInputProps };
export { SelectInput };
