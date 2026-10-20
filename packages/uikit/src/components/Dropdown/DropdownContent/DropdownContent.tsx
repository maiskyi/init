import { type FC, type PropsWithChildren, useContext } from 'react';
import { createPortal } from 'react-dom';

import { DropdownContext } from '../Dropdown.context';
import { DropdownContentDefault } from './DropdownContentDefault';
import { DropdownContentDrawer } from './DropdownContentDrawer';

import styles from '../Dropdown.module.scss';

type DropdownContentProps = PropsWithChildren<{
  className?: string;
}>;

export const DropdownContent: FC<DropdownContentProps> = ({
  children,
  className,
}) => {
  const { isBreakpoint, isOpen, setState } = useContext(DropdownContext);

  const handleOnClosed = () => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  if (!isOpen) return null;

  if (!isBreakpoint) {
    return (
      <DropdownContentDrawer className={className} onClosed={handleOnClosed}>
        <div className="drawer__content">{children}</div>
      </DropdownContentDrawer>
    );
  }

  return createPortal(
    <DropdownContentDefault className={className} onClosed={handleOnClosed}>
      <div className={styles.dropdown__screen}>{children}</div>
    </DropdownContentDefault>,
    document.body,
  );
};
