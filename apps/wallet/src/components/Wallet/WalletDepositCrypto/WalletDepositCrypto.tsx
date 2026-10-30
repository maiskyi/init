import {
  WalletBalanceOption,
  WalletPaymentMethodOption,
} from '@common/components';
import { Form, Grid, Select } from '@rockethash/uikit';
import merge from 'lodash.merge';
import { type FC, Fragment } from 'react';

import { useWalletData } from '../../WalletProvider';
import { useWalletSettings } from '../Wallet.hooks';
import { WALLET_DEPOSIT_CRYPTO_METHODS } from './WalletDepositCrypto.const';
import { type WalletDepositCryptoProps } from './WalletDepositCrypto.types';

const WalletDepositCrypto: FC<WalletDepositCryptoProps> = () => {
  const { userBalances, cryptoCurrencies, paymentMethods } = useWalletData();

  const [settings, setSettings] = useWalletSettings();

  const balance =
    settings?.depositCrypto?.balance || cryptoCurrencies[0].symbol;

  const paymentMethodOptions = paymentMethods.filter(
    (paymentMethod) => paymentMethod.currencies[balance],
  );

  const paymentMethod =
    settings?.depositCrypto.paymentMethod || paymentMethodOptions[0].name;

  const handleOnBalanceChange = (balance: string) => {
    const methods = paymentMethods.filter(
      (paymentMethod) => paymentMethod.currencies[balance],
    );

    setSettings((prev) =>
      merge(prev, {
        depositCrypto: {
          balance,
          paymentMethod: methods[0].name,
        },
      }),
    );
  };

  const handleOnPaymentMethodChange = (paymentMethod: string) => {
    setSettings((prev) =>
      merge(prev, {
        depositCrypto: {
          paymentMethod,
        },
      }),
    );
  };

  const MethodComponent =
    // @ts-expect-error
    WALLET_DEPOSIT_CRYPTO_METHODS[paymentMethod] || Fragment;

  return (
    <Grid spacing={3}>
      <Grid.Cell>
        <Form.Group>
          <Form.Label>Your balance</Form.Label>
          <Select
            getOptionLabel={(params) => (
              <WalletBalanceOption
                {...params}
                // @ts-expect-error
                balance={userBalances.main?.[params.option.symbol]}
              />
            )}
            getOptionValue={({ option }) => option.symbol}
            onChange={handleOnBalanceChange}
            options={cryptoCurrencies}
            placeholder="Select balance"
            value={balance}
          />
        </Form.Group>
      </Grid.Cell>
      <Grid.Cell>
        <Form.Group>
          <Form.Label>Payment method</Form.Label>
          <Select
            getOptionLabel={({ option, isActive }) => (
              <WalletPaymentMethodOption
                isActive={isActive}
                name={option.name}
              />
            )}
            getOptionValue={({ option }) => option.name}
            onChange={handleOnPaymentMethodChange}
            options={paymentMethodOptions}
            value={paymentMethod}
          />
        </Form.Group>
      </Grid.Cell>
      <Grid.Cell>
        <MethodComponent key={balance} />
      </Grid.Cell>
    </Grid>
  );
};

export type { WalletDepositCryptoProps };
export { WalletDepositCrypto };
