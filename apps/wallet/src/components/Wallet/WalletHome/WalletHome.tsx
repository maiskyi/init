import { Card } from '@rockethash/uikit';
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
        WalletHome
      </Card>
      <Card
        as="button"
        className={styles.button}
        glow="blue"
        onClick={handleOnClick}
        outline
      >
        WalletHome
      </Card>
    </div>
  );
};

export { WalletHome };
