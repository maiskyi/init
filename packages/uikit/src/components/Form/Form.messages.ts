import {
  type FormControlValidationErrorFn,
  type FormControlValidationGenericError,
} from './Form.types';
import { type FormCheckboxValidation } from './FormCheckbox';
import { type FormNumberValidation } from './FormNumber';
import { type FormSelectValidation } from './FormSelect';
import { type FormTextValidation } from './FormText';
import { type FormToggleValidation } from './FormToggle';

// import { FormPasswordValidation } from './FormPassword';

const genericError: FormControlValidationErrorFn = ({ label, name }) =>
  `${label || name} is invalid`;

const requiredInputError: FormControlValidationErrorFn = ({ label, name }) =>
  `${label || name} is required`;

// const patternUppercaseInputError: FormControlValidationErrorFn = ({
//   name,
//   label,
// }) => `"${label || name}" must contain at least one uppercase letter`;

// const patternLowercaseInputError: FormControlValidationErrorFn = ({
//   name,
//   label,
// }) => `"${label || name}" must contain at least one lowercase letter`;

// const patternNumberInputError: FormControlValidationErrorFn = ({
//   name,
//   label,
// }) => `"${label || name}" must contain at least one number`;

// const patternSpecialInputError: FormControlValidationErrorFn = ({
//   name,
//   label,
// }) => `"${label || name}" must contain at least one special character`;

const patternInputError: FormControlValidationErrorFn = ({ label, name }) =>
  `${label || name} is invalid`;

const minLengthInputError: FormControlValidationErrorFn = ({
  label,
  name,
  value,
}) => `${label || name} must be at least ${value} characters`;

const maxLengthInputError: FormControlValidationErrorFn = ({
  label,
  name,
  value,
}) => `${label || name} must be not more then ${value} characters`;

const maxInputError: FormControlValidationErrorFn = ({ label, name, value }) =>
  `${label || name} must be not more then ${value}`;

const minInputError: FormControlValidationErrorFn = ({ label, name, value }) =>
  `${label || name} must be at least ${value}`;

// const equalsToInputError: FormControlValidationErrorFn = ({ name, label }) =>
//   `"${label || name}" must be equal to the password`;

export interface FormControlValidationMessages {
  checkbox: {
    errors: Record<keyof FormCheckboxValidation, FormControlValidationErrorFn> &
      FormControlValidationGenericError;
  };
  number: {
    errors: Record<keyof FormNumberValidation, FormControlValidationErrorFn> &
      FormControlValidationGenericError;
  };
  select: {
    errors: Record<keyof FormSelectValidation, FormControlValidationErrorFn> &
      FormControlValidationGenericError;
  };
  text: {
    errors: Record<keyof FormTextValidation, FormControlValidationErrorFn> &
      FormControlValidationGenericError;
  };
  toggle: {
    errors: Record<keyof FormToggleValidation, FormControlValidationErrorFn> &
      FormControlValidationGenericError;
  };
}

export const VALIDATION_MESSAGES: FormControlValidationMessages = {
  checkbox: {
    errors: {
      generic: genericError,
      required: requiredInputError,
    },
  },
  number: {
    errors: {
      generic: genericError,
      max: maxInputError,
      min: minInputError,
      required: requiredInputError,
    },
  },
  select: {
    errors: {
      generic: genericError,
      required: requiredInputError,
    },
  },
  text: {
    errors: {
      email: patternInputError,
      generic: genericError,
      maxLength: maxLengthInputError,
      minLength: minLengthInputError,
      pattern: patternInputError,
      required: requiredInputError,
    },
  },
  toggle: {
    errors: {
      generic: genericError,
      required: requiredInputError,
    },
  },
};
