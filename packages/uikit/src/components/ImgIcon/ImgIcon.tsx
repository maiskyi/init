import { type FC } from 'react';

import { IMG_ICONS } from './ImgIcon.const';
import { type ImgIconName } from './ImgIcon.types';

interface ImgIconProps {
  className?: string;
  height?: number;
  name: ImgIconName;
  width?: number;
}

// Rest spread forwards only the props that were passed: an explicit
// `width={undefined}` would drop the SVG file's own width.
const ImgIcon: FC<ImgIconProps> = ({ name, ...props }) => {
  const Icon = IMG_ICONS[name];

  if (!Icon) return null;

  return <Icon {...props} />;
};

export type { ImgIconProps };
export { ImgIcon };
