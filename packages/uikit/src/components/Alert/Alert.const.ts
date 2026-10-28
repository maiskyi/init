import { type IconName } from '../Icon';
import { type AlertVariant } from './Alert.types';

export const ALERT_DEFAULT_ICONS: Record<AlertVariant, IconName> = {
  default: 'face',
  error: 'cancel',
  info: 'support',
  success: 'check-circle',
  warning: 'alert',
};
