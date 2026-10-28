import {
  Card,
  CryptoIcon,
  Divider,
  FiatIcon,
  Grid,
  ImgIcon,
} from '@rockethash/uikit';
import cn from 'classnames';
import { type FC } from 'react';

import { CRYPTO_ICONS, FIAT_ICONS } from './WalletHome.const';

import styles from './WalletHome.module.scss';

interface WalletHomeProps {
  temp?: number;
}

const WalletHome: FC<WalletHomeProps> = () => {
  const handleOnClick = () => {
    console.log('click');
  };

  return (
    <Grid spacing={3}>
      <Grid.Cell md={6} xs={12}>
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
      </Grid.Cell>
      <Grid.Cell md={6} xs={12}>
        <Card
          as="button"
          className={styles.button}
          glow="blue"
          onClick={handleOnClick}
          outline
        >
          <FiatIcon name="CARD" size={30} />
          Buy Crypto
          <span className={styles.payments}>
            <ImgIcon height={12} name="google-pay" />
            <ImgIcon height={12} name="apple-pay" />
            <ImgIcon height={12} name="visa" />
            <ImgIcon height={12} name="mastercard" />
          </span>
        </Card>
      </Grid.Cell>
      <Grid.Cell xs={12}>
        <Card
          as="button"
          className={cn(styles.button, styles.cash)}
          onClick={handleOnClick}
          outline
        >
          <span className={styles.currencies}>
            {FIAT_ICONS.map((icon) => (
              <FiatIcon key={icon} name={icon} size={14} />
            ))}
          </span>
          Deposit Cash
        </Card>
      </Grid.Cell>
      <Grid.Cell xs={12}>
        <Divider thickness={2} />
      </Grid.Cell>
    </Grid>
  );
};

export { WalletHome };
