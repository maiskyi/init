import { type FormCheckboxRules } from './FormCheckbox.types';

export const FORM_CHECKBOX_RULES: FormCheckboxRules = {
  checkbox: {
    required: ({ message, value }) => ({
      required: {
        message,
        value: value as boolean,
      },
    }),
  },
};
