import noop from 'lodash.noop';
import {
  createContext,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from 'react';

import {
  type DropdownController,
  type DropdownPlacement,
  type DropdownState,
} from './Dropdown.types';

export interface DropdownContextProps {
  close: () => void;
  contentRef: RefObject<HTMLDivElement>;
  dropdownControllerRef: RefObject<DropdownController>;
  isBreakpoint: boolean;
  isOpen: boolean;
  onClosed: () => void;
  onOpened: () => void;
  open: () => void;
  placement: DropdownPlacement;
  setState: Dispatch<SetStateAction<DropdownState>>;
  toggleRef: RefObject<HTMLElement>;
}

export const DropdownContext = createContext<DropdownContextProps>({
  close: noop,
  contentRef: { current: null },
  dropdownControllerRef: { current: null },
  isBreakpoint: false,
  isOpen: false,
  onClosed: noop,
  onOpened: noop,
  open: noop,
  placement: 'bottom-right',
  setState: noop,
  toggleRef: { current: null },
});
