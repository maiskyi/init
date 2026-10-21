import cn from 'classnames';
import { type FC, forwardRef, type PropsWithChildren } from 'react';

import { Dropdown, useDropdown } from '../../Dropdown';
import { type SelectSize } from '../Select.type';

import styles from '../Select.module.scss';

type SelectHolderProps = PropsWithChildren<{
  className?: string;
  disabled?: boolean;
  size: SelectSize;
}>;

const SelectHolder: FC<SelectHolderProps> = forwardRef<
  HTMLDivElement,
  SelectHolderProps
>(({ children, className, size, disabled = false }, ref) => {
  const { isOpen } = useDropdown();

  return (
    <div className={cn(styles.holder, className)} ref={ref}>
      <div
        className={cn(styles.value, styles[size], {
          [`${styles.opened}`]: isOpen,
          [`${styles.disabled}`]: disabled,
        })}
      >
        {children}
        <Dropdown.ToggleArrow className={styles.arrow} />
      </div>
    </div>
  );
});

export { SelectHolder };
