import cn from 'classnames';
import { type CSSProperties, type Fragment, type ReactElement } from 'react';

import {
  type PolymorphicElement,
  type PolymorphicProps,
} from '../../types/polymorphic.types';
import { type GridSpacing } from './Grid.types';
import { GridCell } from './GridCell';

import styles from './Grid.module.scss';

type GridProps<C extends PolymorphicElement> = PolymorphicProps<
  C,
  {
    className?: string;
    colSpacing?: GridSpacing;
    rowSpacing?: GridSpacing;
    spacing?: GridSpacing;
    style?: CSSProperties;
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
  colSpacing,
  rowSpacing,
  spacing = 0,
  style,
  ...props
}) => {
  return (
    <Component
      className={cn(styles.grid, className)}
      style={
        {
          '--grid-col-spacing': colSpacing ?? spacing,
          '--grid-row-spacing': rowSpacing ?? spacing,
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      {children}
    </Component>
  );
};

Grid.Cell = GridCell;

export type { GridProps };
export { Grid };
