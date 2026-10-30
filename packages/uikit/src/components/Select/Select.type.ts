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

type SelectGetOptionValueFunction<T extends object, V> = (
  params: SelectGetOptionValueFunctionParams<T>,
) => V;

export type {
  SelectGetOptionLabelFunction,
  SelectGetOptionValueFunction,
  SelectSize,
};
