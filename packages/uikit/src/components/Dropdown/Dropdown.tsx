import noop from 'lodash.noop';
import {
  type ForwardRefExoticComponent,
  forwardRef,
  type PropsWithChildren,
  type RefAttributes,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useBreakpoint } from '../../hooks/useBreakpoint';
import { type BreakpointToken } from '../../types/breakpointToken.types';
import { DropdownContext } from './Dropdown.context';
import {
  type DropdownComponent,
  type DropdownController,
  type DropdownPlacement,
  type DropdownState,
} from './Dropdown.types';
import { DropdownContent } from './DropdownContent';
import { DropdownHeader } from './DropdownHeader';
import { DropdownMenu } from './DropdownMenu';
import { DropdownMenuDivider } from './DropdownMenuDivider';
import { DropdownMenuItem } from './DropdownMenuItem';
import { DropdownToggle } from './DropdownToggle';
import { DropdownToggleArrow } from './DropdownToggleArrow';

export type DropdownProps = PropsWithChildren<{
  breakpoint?: BreakpointToken;
  onClosed?: () => void;
  onOpened?: () => void;
  placement?: DropdownPlacement;
}>;

interface DropdownCompoundedComponent
  extends ForwardRefExoticComponent<
    DropdownProps & RefAttributes<DropdownComponent>
  > {
  Content: typeof DropdownContent;
  Header: typeof DropdownHeader;
  Menu: typeof DropdownMenu;
  MenuDivider: typeof DropdownMenuDivider;
  MenuItem: typeof DropdownMenuItem;
  Toggle: typeof DropdownToggle;
  ToggleArrow: typeof DropdownToggleArrow;
}

export const Dropdown = forwardRef<DropdownComponent, DropdownProps>(
  function Dropdown(
    {
      breakpoint = 'sm',
      children,
      onClosed = noop,
      onOpened = noop,
      placement = 'bottom-right',
    },
    ref,
  ) {
    const [{ isOpen }, setState] = useState<DropdownState>({
      isOpen: false,
    });

    const { matches: isBreakpoint } = useBreakpoint({
      token: breakpoint,
    });

    const toggleRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const dropdownControllerRef = useRef<DropdownController>(null);

    const close = useCallback(() => {
      dropdownControllerRef.current?.close();
    }, []);

    const open = useCallback(() => {
      setState((prev) => ({
        ...prev,
        isOpen: true,
      }));
    }, []);

    const contextValue = useMemo(
      () => ({
        breakpoint,
        close,
        contentRef,
        dropdownControllerRef,
        isBreakpoint,
        isOpen,
        onClosed,
        onOpened,
        open,
        placement,
        setState,
        toggleRef,
      }),
      [
        breakpoint,
        isBreakpoint,
        isOpen,
        placement,
        close,
        open,
        onClosed,
        onOpened,
      ],
    );

    useImperativeHandle(ref, () => ({
      close,
      open,
    }));

    return (
      <DropdownContext.Provider value={contextValue}>
        {children}
      </DropdownContext.Provider>
    );
  },
) as DropdownCompoundedComponent;

Dropdown.Menu = DropdownMenu;
Dropdown.MenuItem = DropdownMenuItem;
Dropdown.Toggle = DropdownToggle;
Dropdown.Content = DropdownContent;
Dropdown.Header = DropdownHeader;
Dropdown.MenuDivider = DropdownMenuDivider;
Dropdown.ToggleArrow = DropdownToggleArrow;
