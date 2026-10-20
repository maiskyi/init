import { type ControllerProps } from 'react-hook-form';
import { type PartialDeep } from 'type-fest';

import { type FORM_CONTROL_RULES } from './Form.const';

export interface FormInstance<T extends object = object> {
  reset: (values?: PartialDeep<T>) => void;
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
