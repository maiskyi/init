import { createContext } from 'react';

interface SelectContextProps {
  value?: unknown;
}

const SelectContext = createContext<SelectContextProps>({});

export type { SelectContextProps };
export { SelectContext };
