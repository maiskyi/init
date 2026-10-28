import { type PropsWithChildren, type ReactElement } from 'react';

import { type MenuItem } from './MenuItem';

export type MenuProps = PropsWithChildren<{
  className?: string;
}>;

export interface MenuCompoundedComponent {
  Item: typeof MenuItem;
  (props: MenuProps): ReactElement;
}
