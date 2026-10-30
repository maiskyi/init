import cn from 'classnames';
import { type ElementType, type ReactElement } from 'react';

import { type PolymorphicProps } from '../../types/polymorphic.types';
import { type TextSize, type TextTag, type TextWeight } from './Text.types';

import styles from './Text.module.scss';

type TextProps<C extends TextTag = 'p'> = PolymorphicProps<
  C,
  {
    className?: string;
    size?: TextSize;
    uppercase?: boolean;
    weight?: TextWeight;
  }
>;

interface TextComponent {
  <C extends TextTag = 'p'>(props: TextProps<C>): ReactElement;
}

const Text: TextComponent = ({
  as: Component = 'p',
  children,
  className,
  size = 'regular',
  uppercase = false,
  weight = 'regular',
  ...props
}) => {
  // `C` is still an unresolved type parameter here, so TypeScript cannot
  // prove the forwarded props fit the chosen intrinsic element. The public
  // `TextProps<C>` surface is what narrows them; this widening is internal.
  const Element = Component as ElementType;

  return (
    <Element
      className={cn(
        styles.text,
        styles[`text_size_${size}`],
        styles[`text_weight_${weight}`],
        {
          [`${styles.text_uppercase}`]: uppercase,
        },
        className,
      )}
      {...props}
    >
      {children}
    </Element>
  );
};

export type { TextProps };
export { Text };
