import {
  type FormControlBaseValidation,
  type FormControlRuleFunction,
} from '../Form.types';

export interface FormNumberValidation extends FormControlBaseValidation {
  max?: number;
  min?: number;
}

export interface FormNumberRules {
  number: Record<keyof FormNumberValidation, FormControlRuleFunction>;
}
