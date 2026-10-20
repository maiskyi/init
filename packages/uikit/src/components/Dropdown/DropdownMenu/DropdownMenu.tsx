import cn from 'classnames';
import { type FC, type PropsWithChildren } from 'react';

import styles from '../Dropdown.module.scss';

type DropdownMenuProps = PropsWithChildren<{
  className?: string;
}>;

export const DropdownMenu: FC<DropdownMenuProps> = ({
  children,
  className,
}) => {
  return <ul className={cn(styles.menu, className)}>{children}</ul>;
};
