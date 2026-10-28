export type IconName =
  | 'safe'
  | 'exchange'
  | 'chevron-right'
  | 'chevron-down'
  | 'check-circle'
  | 'arrow-up';

export const ICON_CODEPOINTS: { [key in IconName]: string } = {
  'safe': '61702',
  'exchange': '61701',
  'chevron-right': '61700',
  'chevron-down': '61699',
  'check-circle': '61698',
  'arrow-up': '61697',
};
