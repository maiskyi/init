import { type FC } from 'react';

import styles from '../Dropdown.module.scss';

export const DropdownMenuDivider: FC = () => {
  return <li className={styles.menu__divider} />;
};
