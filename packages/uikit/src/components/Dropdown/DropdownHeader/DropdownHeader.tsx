import cn from 'classnames';
import { type FC, type PropsWithChildren, useContext } from 'react';

import { DropdownContext } from '../Dropdown.context';

import styles from '../Dropdown.module.scss';

type DropdownHeaderProps = PropsWithChildren<{
  className?: string;
}>;

export const DropdownHeader: FC<DropdownHeaderProps> = ({
  children,
  className,
}) => {
  const { close, isBreakpoint } = useContext(DropdownContext);

  if (isBreakpoint) return null;

  return (
    <div className={cn('header', styles.header, className)}>
      {children}
      <button
        aria-label="close"
        className={styles.header__close}
        onClick={close}
        type="button"
      >
        <span className="icon-close" />
      </button>
    </div>
  );
};
