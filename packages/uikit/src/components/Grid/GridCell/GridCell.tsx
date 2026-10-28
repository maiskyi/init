import cn from 'classnames';
import { type Fragment, type ReactElement } from 'react';

import {
  type PolymorphicElement,
  type PolymorphicProps,
} from '../../../types/polymorphic.types';

import styles from '../Grid.module.scss';

type GridCellProps<C extends PolymorphicElement> = PolymorphicProps<
  C,
  {
    className?: string;
  }
>;

interface GridCellComponent {
  <C extends PolymorphicElement = typeof Fragment>(
    props: GridCellProps<C>,
  ): ReactElement;
}

const GridCell: GridCellComponent = ({
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

export type { GridCellProps };
export { GridCell };
