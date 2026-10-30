import {
  Card,
  CryptoIcon,
  Divider,
  FiatIcon,
  Grid,
  Icon,
  ImgIcon,
  Menu,
} from '@rockethash/uikit';
import cn from 'classnames';
import { type FC } from 'react';

import { useWallet } from '../Wallet.hooks';
import { WalletScreen } from '../Wallet.types';
import { CRYPTO_ICONS, FIAT_ICONS } from './WalletHome.const';
import { type WalletHomeProps } from './WalletHome.types';

import styles from './WalletHome.module.scss';

const WalletHome: FC<WalletHomeProps> = () => {
  const { setActiveScreen } = useWallet();

  const handleOnDepositCryptoClick = () => {
    setActiveScreen({
      name: WalletScreen.DepositCrypto,
      props: {},
    });
  };

  const handleOnBuyCryptoClick = () => {
    setActiveScreen({
      name: WalletScreen.BuyCrypto,
      props: {},
    });
  };

  const handleOnDepositCashClick = () => {
    setActiveScreen({
      name: WalletScreen.DepositCash,
      props: {},
    });
  };

  const handleOnWithdrawClick = () => {
    setActiveScreen({
      name: WalletScreen.Withdraw,
      props: {},
    });
  };

  const handleOnSwapClick = () => {
    setActiveScreen({
      name: WalletScreen.Swap,
      props: {},
    });
  };

  const handleOnVaultClick = () => {
    setActiveScreen({
      name: WalletScreen.Vault,
      props: {},
    });
  };

  return (
    <Grid spacing={3}>
      <Grid.Cell xss={6}>
        <Card
          as="button"
          className={styles.button}
          glow="green"
          onClick={handleOnDepositCryptoClick}
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
      <Grid.Cell xss={6}>
        <Card
          as="button"
          className={styles.button}
          glow="blue"
          onClick={handleOnBuyCryptoClick}
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
      <Grid.Cell xss={12}>
        <Card
          as="button"
          className={cn(styles.button, styles.cash)}
          onClick={handleOnDepositCashClick}
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
      <Grid.Cell xss={12}>
        <Divider thickness={2} />
      </Grid.Cell>
      <Grid.Cell xss={12}>
        <Menu>
          <Menu.Item
            onClick={handleOnWithdrawClick}
            prefix={<Icon name="arrow-up" />}
            suffix={<Icon name="chevron-right" />}
          >
            Withdraw
          </Menu.Item>
          <Menu.Item
            onClick={handleOnSwapClick}
            prefix={<Icon name="exchange" />}
            suffix={<Icon name="chevron-right" />}
          >
            Swap
          </Menu.Item>
          <Menu.Item
            onClick={handleOnVaultClick}
            prefix={<Icon name="safe" />}
            suffix={<Icon name="chevron-right" />}
          >
            Vault
          </Menu.Item>
        </Menu>
      </Grid.Cell>
    </Grid>
  );
};

export type { WalletHomeProps };
export { WalletHome };
