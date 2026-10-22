import {
  type FormControlBaseValidation,
  type FormControlRuleFunction,
} from '../Form.types';

export interface FormToggleValidation extends FormControlBaseValidation {}

export interface FormToggleRules {
  toggle: Record<keyof FormToggleValidation, FormControlRuleFunction>;
}
