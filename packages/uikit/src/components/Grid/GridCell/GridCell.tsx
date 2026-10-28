import cn from 'classnames';
import { type Fragment, type ReactElement } from 'react';

import {
  type PolymorphicElement,
  type PolymorphicProps,
} from '../../../types/polymorphic.types';
import { GRID_CELL_BREAKPOINTS } from './GridCell.const';
import {
  type GridCellBreakpointProps,
  type GridCellSpan,
} from './GridCell.types';

import styles from '../Grid.module.scss';

type GridCellProps<C extends PolymorphicElement> = PolymorphicProps<
  C,
  GridCellBreakpointProps & {
    className?: string;
    span?: GridCellSpan;
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
  ld,
  ld_max,
  ld_xl,
  ld_xxl,
  ld_xxxl,
  md,
  md_max,
  sm,
  sm_max,
  span,
  xs,
  xss,
  ...props
}) => {
  const breakpoints: GridCellBreakpointProps = {
    ld,
    ld_max,
    ld_xl,
    ld_xxl,
    ld_xxxl,
    md,
    md_max,
    sm,
    sm_max,
    xs,
    xss,
  };

  return (
    <Component
      className={cn(
        styles.cell,
        span && styles[`span-${span}`],
        GRID_CELL_BREAKPOINTS.map(
          (token) =>
            breakpoints[token] && styles[`${token}-${breakpoints[token]}`],
        ),
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export type { GridCellProps };
export { GridCell };
