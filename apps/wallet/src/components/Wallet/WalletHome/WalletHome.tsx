import { Card } from '@rockethash/uikit';
import cn from 'classnames';
import { type FC } from 'react';

import styles from './WalletHome.module.scss';

interface WalletHomeProps {
  temp?: number;
}

const WalletHome: FC<WalletHomeProps> = () => {
  const handleOnClick = () => {
    console.log('click');
  };

  return (
    <div>
      <Card
        as="button"
        className={styles.button}
        glow="green"
        onClick={handleOnClick}
        outline
      >
        Deposit Crypto
      </Card>
      <Card
        as="button"
        className={styles.button}
        glow="blue"
        onClick={handleOnClick}
        outline
      >
        Buy Crypto
      </Card>
      <Card
        as="button"
        className={cn(styles.button, styles.cash)}
        onClick={handleOnClick}
        outline
      >
        Deposit Cash
      </Card>
    </div>
  );
};

export { WalletHome };
