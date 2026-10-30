import {
  type ControllerProps,
  type FieldPath,
  type FieldPathValue,
  type FieldValues,
} from 'react-hook-form';

import { type FORM_CONTROL_RULES } from './Form.const';

export interface FormRefSetValueMethodParams<
  T extends FieldValues,
  N extends FieldPath<T>,
> {
  name: N;
  value: FieldPathValue<T, N>;
}

export type FormRefSetValueMethod<T extends FieldValues = FieldValues> = <
  N extends FieldPath<T>,
>(
  params: FormRefSetValueMethodParams<T, N>,
) => void;

export interface FormRef<T extends FieldValues = FieldValues> {
  setValue: FormRefSetValueMethod<T>;
  submit: () => Promise<unknown>;
}

export interface FormControlBaseValidationFnParams {
  values: object;
}

export type FormControlBaseValidationFn<T> = (
  params: FormControlBaseValidationFnParams,
) => T;

export interface FormControlBaseValidation {
  required?: boolean | FormControlBaseValidationFn<boolean>;
}

interface FormControlRuleFunctionParams {
  message: string;
  value: unknown;
}

export type FormControlRuleFunction = (
  params: FormControlRuleFunctionParams,
) => ControllerProps['rules'];

export type FormControlType = keyof typeof FORM_CONTROL_RULES;

interface FormControlValidationGenericErrorFnParams {
  code: string;
  label?: string;
  name: string;
  value?: unknown;
}

export interface FormControlValidationGenericError {
  generic: (v: FormControlValidationGenericErrorFnParams) => string;
}

export interface FormControlValidationErrorFnParams {
  label?: string;
  name: string;
  value?: unknown;
}

export type FormControlValidationErrorFn = (
  params: FormControlValidationErrorFnParams,
) => string;
