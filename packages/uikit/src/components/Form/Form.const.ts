import { FORM_NUMBER_RULES } from './FormNumber/FormNumber.const';
import { type FormNumberRules } from './FormNumber/FormNumber.types';
import { FORM_SELECT_RULES } from './FormSelect/FormSelect.const';
import { type FormSelectRules } from './FormSelect/FormSelect.types';
import { FORM_TEXT_RULES } from './FormText/FormText.const';
import { type FormTextRules } from './FormText/FormText.types';
import { FORM_TOGGLE_RULES } from './FormToggle/FormToggle.const';
import { type FormToggleRules } from './FormToggle/FormToggle.types';

interface FormControlRules
  extends FormTextRules,
    FormSelectRules,
    FormToggleRules,
    FormNumberRules {}

export const FORM_CONTROL_RULES: FormControlRules = {
  ...FORM_TEXT_RULES,
  ...FORM_SELECT_RULES,
  ...FORM_TOGGLE_RULES,
  ...FORM_NUMBER_RULES,
};
