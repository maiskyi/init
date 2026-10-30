/// <reference types="vite-plugin-svgr/client" />

import ApplePay from './duckdice/apple-pay.svg?react';
import GooglePay from './duckdice/google-pay.svg?react';
import Mastercard from './duckdice/mastercard.svg?react';
import Visa from './duckdice/visa.svg?react';
import { type ImgIconName } from './ImgIcon.types';

export const IMG_ICONS: Record<ImgIconName, typeof ApplePay> = {
  'apple-pay': ApplePay,
  'google-pay': GooglePay,
  mastercard: Mastercard,
  visa: Visa,
};
