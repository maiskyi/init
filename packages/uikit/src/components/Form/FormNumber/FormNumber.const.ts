import { type FormNumberRules } from './FormNumber.types';

export const FORM_NUMBER_RULES: FormNumberRules = {
  number: {
    max: ({ message, value }) => ({
      max: {
        message,
        value: value as number,
      },
    }),
    min: ({ message, value }) => ({
      min: {
        message,
        value: value as number,
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
