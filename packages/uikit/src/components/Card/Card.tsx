import cn from 'classnames';
import { type Fragment, type ReactElement } from 'react';

import {
  type PolymorphicElement,
  type PolymorphicProps,
} from '../../types/polymorphic.types';
import { type CardGlow } from './Card.types';

import styles from './Card.module.scss';

type CardProps<C extends PolymorphicElement> = PolymorphicProps<
  C,
  {
    className?: string;
    outline?: boolean;
    onClick?: () => void;
    glow?: CardGlow;
  }
>;

interface CardComponent {
  <C extends PolymorphicElement = typeof Fragment>(
    props: CardProps<C>,
  ): ReactElement;
}

const Card: CardComponent = ({
  className,
  children,
  outline = false,
  onClick,
  glow = 'none',
  as: Component = 'div',
  ...props
}) => {
  const handleOnClick = () => {
    onClick?.();
  };

  return (
    <Component
      className={cn(
        styles.card,
        styles[glow],
        {
          [`${styles.outline}`]: outline,
          [`${styles.clickable}`]: !!onClick,
          [`${styles.glow}`]: glow !== 'none',
        },
        className,
      )}
      onClick={handleOnClick}
      {...props}
    >
      {children}
    </Component>
  );
};

export type { CardProps };
export { Card };
