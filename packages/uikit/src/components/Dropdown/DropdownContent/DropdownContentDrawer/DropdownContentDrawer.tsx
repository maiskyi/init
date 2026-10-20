import cn from 'classnames';
import {
  type AnimationEventHandler,
  type FC,
  type PropsWithChildren,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { DropdownContext } from '../../Dropdown.context';

import styles from '../../Dropdown.module.scss';

type DropdownContentDrawerProps = PropsWithChildren<{
  className?: string;
  onClosed: () => void;
}>;

export const DropdownContentDrawer: FC<DropdownContentDrawerProps> = ({
  children,
  className,
  onClosed,
}) => {
  const {
    dropdownControllerRef,
    onClosed: onDropdownClosed,
    onOpened: onDropdownOpened,
  } = useContext(DropdownContext);

  const [isVisible, setIsVisible] = useState(true);

  const handleOnCloseClick = () => {
    setIsVisible(false);
  };

  const handleOnAnimationEnd: AnimationEventHandler<HTMLDivElement> = (
    event,
  ) => {
    if (event.target !== event.currentTarget || isVisible) return;
    onClosed();
  };

  useImperativeHandle(dropdownControllerRef, () => ({
    close: handleOnCloseClick,
  }));

  // biome-ignore lint/correctness/useExhaustiveDependencies: We need to call onDropdownOpened and onDropdownClosed on mount and cleanup on unmount
  useEffect(() => {
    onDropdownOpened();
    return () => onDropdownClosed();
  }, []);

  return createPortal(
    <div className={cn('drawer', styles.drawer, className)}>
      <div
        className={cn(
          styles.drawer__overlay,
          !isVisible && styles.drawer__overlay_hidden,
        )}
        onClick={handleOnCloseClick}
      />
      <div
        className={cn(
          styles.drawer__screen,
          !isVisible && styles.drawer__screen_hidden,
        )}
        onAnimationEnd={handleOnAnimationEnd}
      >
        <div className="drawer__content">{children}</div>
      </div>
    </div>,
    document.body,
  );
};
