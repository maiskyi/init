// import { FORM_CHECKBOX_GROUP_RULES } from "./FormCheckboxGroup/FormCheckboxGroup.const";
// import type { FormCheckboxGroupRules } from "./FormCheckboxGroup/FormCheckboxGroup.types";
// import { FORM_PASSWORD_RULES } from "./FormPassword/FormPassword.const";
// import type { FormPasswordRules } from "./FormPassword/FormPassword.types";
// import { FORM_RADIO_GROUP_RULES } from "./FormRadioGroup/FormRadioGroup.const";
// import type { FormRadioGroupRules } from "./FormRadioGroup/FormRadioGroup.types";
// import { FORM_SELECT_RULES } from "./FormSelect/FormSelect.const";
// import type { FormSelectRules } from "./FormSelect/FormSelect.types";
import { FORM_TEXT_RULES } from './FormText/FormText.const';
import { type FormTextRules } from './FormText/FormText.types';

interface FormControlRules extends FormTextRules {}
// FormPasswordRules,
// FormCheckboxGroupRules,
// FormRadioGroupRules,
// FormSelectRules {}

export const FORM_CONTROL_RULES: FormControlRules = {
  ...FORM_TEXT_RULES,
  //   ...FORM_PASSWORD_RULES,
  //   ...FORM_CHECKBOX_GROUP_RULES,
  //   ...FORM_RADIO_GROUP_RULES,
  //   ...FORM_SELECT_RULES,
};
