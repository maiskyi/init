import { Card, CryptoIcon, FiatIcon } from '@rockethash/uikit';
import cn from 'classnames';
import { type FC } from 'react';

import { CRYPTO_ICONS } from './WalletHome.const';

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
        <CryptoIcon name="USDT" size={30} />
        Deposit Crypto
        <span className={styles.currencies}>
          {CRYPTO_ICONS.map((icon) => (
            <CryptoIcon
              className={styles.icon}
              key={icon}
              name={icon}
              size={14}
            />
          ))}
          <span className={styles.counter}>39</span>
        </span>
      </Card>
      <Card
        as="button"
        className={styles.button}
        glow="blue"
        onClick={handleOnClick}
        outline
      >
        <FiatIcon name="FIAT" size={30} />
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
