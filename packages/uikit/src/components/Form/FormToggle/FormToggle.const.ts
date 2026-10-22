import { type FormToggleRules } from './FormToggle.types';

export const FORM_TOGGLE_RULES: FormToggleRules = {
  toggle: {
    required: ({ message, value }) => ({
      required: {
        message,
        value: value as boolean,
      },
    }),
  },
};
