import { type ReactNode } from 'react';

type SelectSize = 'small' | 'medium';

interface SelectGetOptionLabelFunctionParams<T extends object> {
  isActive: boolean;
  option: T;
}

interface SelectGetOptionValueFunctionParams<T extends object> {
  option: T;
}

type SelectGetOptionLabelFunction<T extends object> = (
  params: SelectGetOptionLabelFunctionParams<T>,
) => ReactNode;

type SelectGetOptionValueFunction<T extends object> = (
  params: SelectGetOptionValueFunctionParams<T>,
) => string | number;

export type {
  SelectGetOptionLabelFunction,
  SelectGetOptionValueFunction,
  SelectSize,
};
