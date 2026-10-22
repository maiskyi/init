import cn from 'classnames';
import {
  type FC,
  type PropsWithChildren,
  type TransitionEventHandler,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

import { OutsideClickHandler } from '../../../OutsideClickHandler';
import { DropdownContext } from '../../Dropdown.context';
import { useDropdownContentPosition } from './DropdownContentDefault.hooks';

import styles from '../../Dropdown.module.scss';

type DropdownContentDefaultProps = PropsWithChildren<{
  className?: string;
  onClosed: () => void;
  matchToggleWidth: boolean;
}>;

export const DropdownContentDefault: FC<DropdownContentDefaultProps> = ({
  children,
  className,
  onClosed,
  matchToggleWidth,
}) => {
  const {
    contentRef,
    dropdownControllerRef,
    onClosed: onDropdownClosed,
    onOpened: onDropdownOpened,
    placement,
  } = useContext(DropdownContext);

  const [isVisible, setIsVisible] = useState(false);

  const { width, ...position } = useDropdownContentPosition({
    placement,
  });

  const handleOnOutsideClick = () => {
    setIsVisible(false);
  };

  const handleOnTransitionEnd: TransitionEventHandler<HTMLDivElement> = (
    event,
  ) => {
    if (
      event.target !== event.currentTarget ||
      event.propertyName !== 'opacity' ||
      isVisible
    )
      return;

    onClosed();
  };

  useImperativeHandle(dropdownControllerRef, () => ({
    close: handleOnOutsideClick,
  }));

  // biome-ignore lint/correctness/useExhaustiveDependencies: We need to call onDropdownOpened and onDropdownClosed on mount and cleanup on unmount
  useEffect(() => {
    setIsVisible(true);
    onDropdownOpened();
    return () => onDropdownClosed();
  }, []);

  return (
    <OutsideClickHandler onOutsideClick={handleOnOutsideClick}>
      <div
        className={cn(
          styles.dropdown,
          styles[`dropdown_${placement}`],
          {
            [`${styles.dropdown_open}`]: isVisible,
          },
          className,
        )}
        onTransitionEnd={handleOnTransitionEnd}
        ref={contentRef}
        style={{ ...position, minWidth: matchToggleWidth ? width : undefined }}
      >
        <div className={styles.dropdown__screen}>{children}</div>
      </div>
    </OutsideClickHandler>
  );
};
