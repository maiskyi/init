import get from 'lodash.get';
import invoke from 'lodash.invoke';
import merge from 'lodash.merge';
import * as ReactFormHook from 'react-hook-form';
import { type ControllerProps } from 'react-hook-form';

import { FORM_CONTROL_RULES } from './Form.const';
import { VALIDATION_MESSAGES } from './Form.messages';
import {
  type FormControlBaseValidation,
  type FormControlType,
} from './Form.types';

const { useWatch } = ReactFormHook;

type FormItemRules = ControllerProps['rules'];

interface UseFormControlRulesReturnType {
  rules: FormItemRules;
}

interface UseFormControlRulesParams {
  errors?: Partial<Record<string, string | string[]>>;
  label?: string;
  name: string;
  type: FormControlType;
  validation?: FormControlBaseValidation;
}

export const useFormControlRules = ({
  errors: fieldsErrorMessages = {},
  label,
  name,
  type,
  validation = {},
}: UseFormControlRulesParams): UseFormControlRulesReturnType => {
  const disabled = !Object.entries(validation).some(
    ([, value]) => typeof value === 'function',
  );

  const values = useWatch({
    disabled,
  });

  const rules: FormItemRules = Object.entries(validation).reduce(
    (res, [key, initialValue]) => {
      const value = (() => {
        if (typeof initialValue === 'function') {
          return initialValue({ values });
        }
        return initialValue;
      })();

      if (typeof value === 'boolean' && !value) {
        return res;
      }

      const message =
        get(fieldsErrorMessages, key) ||
        invoke(VALIDATION_MESSAGES, [type, 'errors', key], {
          label,
          name,
          value,
        });

      const rule = invoke(FORM_CONTROL_RULES, [type, key], {
        message,
        value,
      });

      if (rule?.validate) {
        return merge(res, {
          validate: {
            [key]: rule.validate,
          },
        });
      }

      return merge(res, rule);
    },
    {} as FormItemRules,
  );

  return { rules };
};
