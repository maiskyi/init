import cn from 'classnames';
import { type Fragment, type ReactElement } from 'react';

import {
  type PolymorphicElement,
  type PolymorphicProps,
} from '../../types/polymorphic.types';
import { GridCell } from './GridCell';

import styles from './Grid.module.scss';

type GridProps<C extends PolymorphicElement> = PolymorphicProps<
  C,
  {
    className?: string;
  }
>;

interface GridComponent {
  Cell: typeof GridCell;
  <C extends PolymorphicElement = typeof Fragment>(
    props: GridProps<C>,
  ): ReactElement;
}

const Grid: GridComponent = ({
  className,
  children,
  as: Component = 'div',
  ...props
}) => {
  return (
    <Component className={cn(styles.grid, className)} {...props}>
      {children}
    </Component>
  );
};

Grid.Cell = GridCell;

export type { GridProps };
export { Grid };
