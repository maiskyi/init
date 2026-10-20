import type { ReactElement } from 'react';

export interface FormControlChildrenParams<T> {
  id: string;
  value: T;
  invalid: boolean;
  onBlur: () => void;
  onChange: (...event: unknown[]) => void;
}

export type FormControlChildren<T> = (
  params: FormControlChildrenParams<T>,
) => ReactElement;
