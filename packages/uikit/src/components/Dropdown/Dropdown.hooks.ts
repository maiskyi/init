import { useContext } from 'react';

import { DropdownContext } from './Dropdown.context';

export const useDropdown = () => useContext(DropdownContext);
