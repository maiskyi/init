import type { ControllerProps } from 'react-hook-form';
import type { PartialDeep } from 'type-fest';

import type { FORM_CONTROL_RULES } from './Form.const';

export interface FormInstance<T extends object = object> {
  submit: () => Promise<unknown>;
  reset: (values?: PartialDeep<T>) => void;
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
  name: string;
  label?: string;
  value?: unknown;
  code: string;
}

export interface FormControlValidationGenericError {
  generic: (v: FormControlValidationGenericErrorFnParams) => string;
}

export interface FormControlValidationErrorFnParams {
  name: string;
  label?: string;
  value?: unknown;
}

export type FormControlValidationErrorFn = (
  params: FormControlValidationErrorFnParams,
) => string;
