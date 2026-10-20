import {
  type FormControlBaseValidation,
  type FormControlRuleFunction,
} from '../Form.types';

export interface FormTextValidation extends FormControlBaseValidation {
  email?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: RegExp;
}

export interface FormTextRules {
  text: Record<keyof FormTextValidation, FormControlRuleFunction>;
}

export interface FormTextOnCopyCallbackParams {
  value: string;
}

export type FormTextOnCopyCallback = (
  params: FormTextOnCopyCallbackParams,
) => void;
