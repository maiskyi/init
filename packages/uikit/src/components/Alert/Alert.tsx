import cn from 'classnames';
import { type FC, Fragment, type PropsWithChildren } from 'react';

import { Icon, type IconName } from '../Icon';
import { ALERT_DEFAULT_ICONS } from './Alert.const';
import { type AlertVariant } from './Alert.types';

import styles from './Alert.module.scss';

type AlertProps = PropsWithChildren<{
  className?: string;
  icon?: IconName;
  onClick?: () => void;
  variant?: AlertVariant;
}>;

const Alert: FC<AlertProps> = ({
  children,
  className,
  icon,
  onClick,
  variant = 'default',
}) => {
  const classNames = cn(
    styles.alert,
    styles[variant],
    {
      [`${styles.clickable}`]: !!onClick,
    },
    className,
  );

  const content = (
    <Fragment>
      <span className={styles['leading-icon']}>
        <Icon name={icon ?? ALERT_DEFAULT_ICONS[variant]} size="md" />
      </span>
      <span className={styles.message}>{children}</span>
    </Fragment>
  );

  const handleOnClick = () => {
    onClick?.();
  };

  if (!onClick) {
    return <div className={classNames}>{content}</div>;
  }

  return (
    <button className={classNames} onClick={handleOnClick} type="button">
      {content}
      <span className={styles.chevron}>
        <Icon name="chevron-right" size="md" />
      </span>
    </button>
  );
};

export type { AlertProps };
export { Alert };
