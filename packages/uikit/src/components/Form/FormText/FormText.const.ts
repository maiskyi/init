import type { FormTextRules } from './FormText.types';

export const FORM_TEXT_RULES: FormTextRules = {
  text: {
    email: ({ message }) => ({
      pattern: {
        message,
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
    }),
    maxLength: ({ message, value }) => ({
      maxLength: {
        message,
        value: value as number,
      },
    }),
    minLength: ({ message, value }) => ({
      minLength: {
        message,
        value: value as number,
      },
    }),
    pattern: ({ message, value }) => ({
      pattern: {
        message,
        value: value as RegExp,
      },
    }),
    required: ({ message, value }) => ({
      required: {
        message,
        value: value as boolean,
      },
    }),
  },
};
