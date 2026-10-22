import {
  type FormControlBaseValidation,
  type FormControlRuleFunction,
} from '../Form.types';

export interface FormSelectValidation extends FormControlBaseValidation {}

export interface FormSelectRules {
  select: Record<keyof FormSelectValidation, FormControlRuleFunction>;
}
