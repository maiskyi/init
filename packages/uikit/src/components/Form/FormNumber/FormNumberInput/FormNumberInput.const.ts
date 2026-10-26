import { type NumberFormatValues } from 'react-number-format';

import { type FormNumberInputDataType } from './FormNumberInput.types';

export const FORM_NUMBER_INPUT_DATA_TYPES_MAPPING: Record<
  FormNumberInputDataType,
  keyof NumberFormatValues
> = {
  number: 'floatValue',
  string: 'value',
};
