import cn from 'classnames';
import { type FC, type PropsWithChildren } from 'react';

import styles from '../Form.module.scss';

type FormGroupProps = PropsWithChildren<{
  className?: string;
}>;

const FormGroup: FC<FormGroupProps> = ({ children, className }) => {
  return <div className={cn(styles.group, className)}>{children}</div>;
};

export { FormGroup };
