import cn from 'classnames';

import { type MenuCompoundedComponent } from './Menu.types';
import { MenuItem } from './MenuItem';

import styles from './Menu.module.scss';

export const Menu: MenuCompoundedComponent = ({ children, className }) => {
  return <ul className={cn(styles.menu, className)}>{children}</ul>;
};

Menu.Item = MenuItem;
