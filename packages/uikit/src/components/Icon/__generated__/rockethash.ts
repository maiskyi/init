export type IconName =
  | 'support'
  | 'safe'
  | 'face'
  | 'exchange'
  | 'chevron-right'
  | 'chevron-left'
  | 'chevron-down'
  | 'check-circle'
  | 'cancel'
  | 'arrow-up'
  | 'alert';

export const ICON_CODEPOINTS: { [key in IconName]: string } = {
  'support': '61707',
  'safe': '61706',
  'face': '61705',
  'exchange': '61704',
  'chevron-right': '61703',
  'chevron-left': '61702',
  'chevron-down': '61701',
  'check-circle': '61700',
  'cancel': '61699',
  'arrow-up': '61698',
  'alert': '61697',
};
