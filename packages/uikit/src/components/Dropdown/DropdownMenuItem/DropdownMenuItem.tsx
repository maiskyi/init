import cn from 'classnames';
import noop from 'lodash.noop';
import { type Fragment, type ReactElement, useContext } from 'react';

import {
  type PolymorphicElement,
  type PolymorphicProps,
} from '../../../types/polymorphic.types';
import { Icon } from '../../Icon';
import { DropdownContext } from '../Dropdown.context';

import styles from '../Dropdown.module.scss';

export type DropdownMenuItemProps<C extends PolymorphicElement> =
  PolymorphicProps<
    C,
    {
      active?: boolean;
      className?: string;
      onClick?: () => void;
    }
  >;

interface DropdownMenuItemComponent {
  <C extends PolymorphicElement = typeof Fragment>(
    props: DropdownMenuItemProps<C>,
  ): ReactElement;
}

export const DropdownMenuItem: DropdownMenuItemComponent = ({
  active = false,
  as: Component = 'button',
  children,
  className,
  onClick = noop,
  ...props
}) => {
  const { close } = useContext(DropdownContext);

  const handleOnClick = () => {
    onClick();
    close();
  };

  return (
    <li className={cn(styles.menu__item)} onClick={handleOnClick}>
      <Component
        className={cn(
          styles['menu__item-content'],
          {
            [`${styles['menu__item-content_active']}`]: active,
          },
          className,
        )}
        {...props}
      >
        {children}
      </Component>
      {active && (
        <Icon
          className={cn(styles['menu__item-active-indicator'])}
          name="check-circle"
        />
      )}
    </li>
  );
};
