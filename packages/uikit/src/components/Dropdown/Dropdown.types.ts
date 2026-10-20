export interface DropdownComponent {
  close: () => void;
  open: () => void;
}

export interface DropdownController {
  close: () => void;
}

export type DropdownPlacement =
  | 'bottom-center'
  | 'bottom-left'
  | 'bottom-right'
  | 'right-bottom'
  | 'right-center'
  | 'top-center'
  | 'top-left'
  | 'top-right';

export interface DropdownState {
  isOpen: boolean;
}
