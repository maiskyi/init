import type { ReactElement } from 'react';

export interface FormControlChildrenParams<T> {
  id: string;
  invalid: boolean;
  onBlur: () => void;
  onChange: (...event: unknown[]) => void;
  value: T;
}

export type FormControlChildren<T> = (
  params: FormControlChildrenParams<T>,
) => ReactElement;
