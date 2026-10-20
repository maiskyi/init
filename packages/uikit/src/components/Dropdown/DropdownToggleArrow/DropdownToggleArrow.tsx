import cn from 'classnames';
import { type FC, useContext } from 'react';

import { DropdownContext } from '../Dropdown.context';

import styles from '../Dropdown.module.scss';

interface DropdownToggleArrowProps {
  className?: string;
}

export const DropdownToggleArrow: FC<DropdownToggleArrowProps> = ({
  className,
}) => {
  const { isOpen } = useContext(DropdownContext);

  return (
    <span
      className={cn(
        'icon-keyboard-arrow',
        styles.toggle__arrow,
        {
          [`${styles.toggle__arrow_active}`]: isOpen,
        },
        className,
      )}
    />
  );
};
