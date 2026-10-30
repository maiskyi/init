import cn from 'classnames';
import { type FC } from 'react';

import { type PolymorphicProps } from '../../types/polymorphic.types';
import { type HeadingTag, type HeadingWeight } from './Heading.types';

import styles from './Heading.module.scss';

type HeadingProps = PolymorphicProps<
  HeadingTag,
  {
    className?: string;
    weight?: HeadingWeight;
  }
> & {
  as: HeadingTag;
};

const Heading: FC<HeadingProps> = ({
  as: Component,
  children,
  className,
  weight = 'semibold',
  ...props
}) => {
  return (
    <Component
      className={cn(
        styles.heading,
        styles[`heading_${Component}`],
        styles[`heading_${weight}`],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export type { HeadingProps };
export { Heading };
