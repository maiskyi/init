import cn from 'classnames';
import noop from 'lodash.noop';
import { type Fragment, type ReactElement, type ReactNode } from 'react';

import {
  type PolymorphicElement,
  type PolymorphicProps,
} from '../../../types/polymorphic.types';

import styles from '../Menu.module.scss';

export type MenuItemProps<C extends PolymorphicElement> = PolymorphicProps<
  C,
  {
    active?: boolean;
    className?: string;
    onClick?: () => void;
    prefix?: ReactNode;
    suffix?: ReactNode;
  }
>;

interface MenuItemComponent {
  <C extends PolymorphicElement = typeof Fragment>(
    props: MenuItemProps<C>,
  ): ReactElement;
}

export const MenuItem: MenuItemComponent = ({
  active = false,
  as: Component = 'button',
  children,
  className,
  onClick = noop,
  prefix,
  suffix,
  ...props
}) => {
  const handleOnClick = () => {
    onClick();
  };

  return (
    <li className={cn(styles.menu__item)}>
      <Component
        className={cn(
          styles['menu__item-content'],
          {
            [`${styles['menu__item-content_active']}`]: active,
          },
          className,
        )}
        onClick={handleOnClick}
        type={Component === 'button' ? 'button' : undefined}
        {...props}
      >
        {prefix && (
          <span className={cn(styles['menu__item-prefix'])}>{prefix}</span>
        )}
        <span className={cn(styles['menu__item-label'])}>{children}</span>
        {suffix && (
          <span className={cn(styles['menu__item-suffix'])}>{suffix}</span>
        )}
      </Component>
    </li>
  );
};
