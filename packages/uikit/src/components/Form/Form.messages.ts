import type {
  FormControlValidationErrorFn,
  FormControlValidationGenericError,
} from './Form.types';
// import type { FormPasswordValidation } from "./FormPassword";
import type { FormTextValidation } from './FormText';

// import { FormPasswordValidation } from './FormPassword';

const genericError: FormControlValidationErrorFn = ({ label, name }) =>
  `"${label || name}" is invalid`;

const requiredInputError: FormControlValidationErrorFn = ({ label, name }) =>
  `"${label || name}" is required`;

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
  `"${label || name}" is invalid`;

const minLengthInputError: FormControlValidationErrorFn = ({
  label,
  name,
  value,
}) => `"${label || name}" must be at least ${value} characters`;

const maxLengthInputError: FormControlValidationErrorFn = ({
  label,
  name,
  value,
}) => `"${label || name}" must be not more then ${value} characters`;

// const equalsToInputError: FormControlValidationErrorFn = ({ name, label }) =>
//   `"${label || name}" must be equal to the password`;

export interface FormControlValidationMessages {
  text: {
    errors: Record<keyof FormTextValidation, FormControlValidationErrorFn> &
      FormControlValidationGenericError;
  };
  //   password: {
  //     errors: Record<keyof FormPasswordValidation, FormControlValidationErrorFn> &
  //       FormControlValidationGenericError;
  //   };
}

export const VALIDATION_MESSAGES: FormControlValidationMessages = {
  //   password: {
  //     errors: {
  //       generic: genericError,
  //       maxLength: maxLengthInputError,
  //       minLength: minLengthInputError,
  //       required: requiredInputError,
  //     },
  //   },
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
};
