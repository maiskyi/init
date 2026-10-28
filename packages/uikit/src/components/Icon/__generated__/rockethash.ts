export type IconName =
  | 'support'
  | 'safe'
  | 'face'
  | 'exchange'
  | 'chevron-right'
  | 'chevron-down'
  | 'check-circle'
  | 'cancel'
  | 'arrow-up'
  | 'alert';

export const ICON_CODEPOINTS: { [key in IconName]: string } = {
  'support': '61706',
  'safe': '61705',
  'face': '61704',
  'exchange': '61703',
  'chevron-right': '61702',
  'chevron-down': '61701',
  'check-circle': '61700',
  'cancel': '61699',
  'arrow-up': '61698',
  'alert': '61697',
};
