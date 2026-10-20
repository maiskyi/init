import cn from 'classnames';
import { type FC, type PropsWithChildren } from 'react';

import { type FormInputGroupSize } from './FormInputGroup.types';

import styles from '../Form.module.scss';

type FormInputGroupProps = PropsWithChildren<{
  className?: string;
  size?: FormInputGroupSize;
}>;

const FormInputGroup: FC<FormInputGroupProps> = ({
  children,
  className,
  size = 'medium',
}) => {
  return (
    <div className={cn(styles['input-group'], styles[size], className)}>
      {children}
    </div>
  );
};

export { FormInputGroup };
