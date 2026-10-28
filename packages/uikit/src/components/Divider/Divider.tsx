import cn from 'classnames';
import { type Fragment, type ReactElement } from 'react';

import {
  type PolymorphicElement,
  type PolymorphicProps,
} from '../../types/polymorphic.types';
import {
  type DividerOrientation,
  type DividerThickness,
} from './Divider.types';

import styles from './Divider.module.scss';

type DividerProps<C extends PolymorphicElement> = PolymorphicProps<
  C,
  {
    className?: string;
    orientation?: DividerOrientation;
    thickness?: DividerThickness;
  }
>;

interface DividerComponent {
  <C extends PolymorphicElement = typeof Fragment>(
    props: DividerProps<C>,
  ): ReactElement;
}

const Divider: DividerComponent = ({
  className,
  children: _children,
  orientation = 'horizontal',
  thickness = 1,
  as: Component = 'hr',
  ...props
}) => {
  return (
    <Component
      aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
      className={cn(
        styles.divider,
        styles[orientation],
        styles[`thickness-${thickness}`],
        className,
      )}
      role="separator"
      {...props}
    />
  );
};

export type { DividerProps };
export { Divider };
