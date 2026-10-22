import { type FunctionComponent, type SVGProps } from 'react';

import { type CRYPTO_ICONS } from './CryptoIcon.const';

export type CryptoIconName = keyof typeof CRYPTO_ICONS;

export type CryptoIconComponent = FunctionComponent<
  SVGProps<SVGSVGElement> & {
    title?: string;
    titleId?: string;
    desc?: string;
    descId?: string;
  }
>;
