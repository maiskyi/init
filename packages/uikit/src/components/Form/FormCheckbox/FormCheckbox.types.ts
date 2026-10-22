import {
  type FormControlBaseValidation,
  type FormControlRuleFunction,
} from '../Form.types';

export interface FormCheckboxValidation extends FormControlBaseValidation {}

export interface FormCheckboxRules {
  checkbox: Record<keyof FormCheckboxValidation, FormControlRuleFunction>;
}
