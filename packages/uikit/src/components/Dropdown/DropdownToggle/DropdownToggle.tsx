import {
  Children,
  cloneElement,
  type FC,
  type PropsWithChildren,
  type ReactElement,
  useContext,
} from 'react';

import { useIsomorphicLayoutEffect } from '../../../hooks/useIsomorphicLayoutEffect';
import { DropdownContext } from '../Dropdown.context';

export const DropdownToggle: FC<PropsWithChildren> = ({ children }) => {
  const { close, open, toggleRef } = useContext(DropdownContext);

  const [firstChild] = Children.toArray(children);

  useIsomorphicLayoutEffect(() => {
    const triggerElement = toggleRef.current;

    if (triggerElement) {
      const handleOnClick = () => {
        open();
      };

      triggerElement.addEventListener('click', handleOnClick);

      return () => {
        triggerElement.removeEventListener('click', handleOnClick);
      };
    }
  }, [close, open, toggleRef]);

  return cloneElement(firstChild as ReactElement<{ ref?: typeof toggleRef }>, {
    ref: toggleRef,
  });
};
