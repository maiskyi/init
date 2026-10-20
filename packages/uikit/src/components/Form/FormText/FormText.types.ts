import type {
  FormControlBaseValidation,
  FormControlRuleFunction,
} from '../Form.types';

export interface FormTextValidation extends FormControlBaseValidation {
  email?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
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
