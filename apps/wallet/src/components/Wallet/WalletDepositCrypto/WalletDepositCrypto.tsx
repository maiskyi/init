import {
  WalletBalanceOption,
  WalletPaymentMethodOption,
} from '@common/components';
import { Form, type FormRef, Grid } from '@rockethash/uikit';
import merge from 'lodash.merge';
import { type FC, Fragment, useRef } from 'react';

import { useWalletData } from '../../WalletProvider';
import { useWalletSettings } from '../Wallet.hooks';
import { WALLET_DEPOSIT_CRYPTO_METHODS } from './WalletDepositCrypto.const';
import {
  type WalletDepositCryptoForm,
  WalletDepositCryptoFormFields,
  type WalletDepositCryptoProps,
} from './WalletDepositCrypto.types';

const WalletDepositCrypto: FC<WalletDepositCryptoProps> = () => {
  const { userBalances, cryptoCurrencies, paymentMethods } = useWalletData();
  const formRef = useRef<FormRef<WalletDepositCryptoForm>>(null);

  const [settings, setSettings] = useWalletSettings();

  const defaultBalance =
    settings?.depositCrypto?.balance || cryptoCurrencies[0].symbol;

  const paymentMethodOptions = paymentMethods.filter(
    (paymentMethod) => paymentMethod.currencies[defaultBalance],
  );

  const defaultPaymentMethod =
    settings?.depositCrypto.paymentMethod || paymentMethodOptions[0].name;

  const defaultValues: WalletDepositCryptoForm = {
    [WalletDepositCryptoFormFields.Balance]: defaultBalance,
    [WalletDepositCryptoFormFields.PaymentMethod]: defaultPaymentMethod,
  };

  const handleOnBalanceChange = (balance: string | number) => {
    const methods = paymentMethods.filter(
      (paymentMethod) => paymentMethod.currencies[balance],
    );
    const paymentMethod = methods[0].name;
    formRef.current?.setValue({
      name: WalletDepositCryptoFormFields.PaymentMethod,
      value: paymentMethod,
    });
    setSettings((prev) =>
      merge(prev, {
        depositCrypto: {
          balance,
          paymentMethod,
        },
      }),
    );
  };

  const handleOnPaymentMethodChange = (paymentMethod: string | number) => {
    setSettings((prev) => merge(prev, { depositCrypto: { paymentMethod } }));
  };

  const handleOnSubmit = (data: WalletDepositCryptoForm) => {
    console.log(data);
  };

  const MethodComponent =
    // @ts-expect-error
    WALLET_DEPOSIT_CRYPTO_METHODS[settings?.depositCrypto.paymentMethod] ||
    Fragment;

  return (
    <Form<WalletDepositCryptoForm>
      defaultValues={defaultValues}
      onSubmit={handleOnSubmit}
      ref={formRef}
    >
      <Grid spacing={3}>
        <Grid.Cell>
          <Form.Group>
            <Form.Label>Your balance</Form.Label>
            <Form.Select
              getOptionLabel={(params) => (
                <WalletBalanceOption
                  {...params}
                  // @ts-expect-error
                  balance={userBalances.main?.[params.option.symbol]}
                />
              )}
              getOptionValue={({ option }) => option.symbol}
              name={WalletDepositCryptoFormFields.Balance}
              onChange={handleOnBalanceChange}
              options={cryptoCurrencies}
              placeholder="Select balance"
              validation={{
                required: true,
              }}
            />
          </Form.Group>
        </Grid.Cell>
        <Grid.Cell>
          <Form.Group>
            <Form.Label>Payment method</Form.Label>
            <Form.Select
              getOptionLabel={({ option, isActive }) => (
                <WalletPaymentMethodOption
                  isActive={isActive}
                  name={option.name}
                />
              )}
              getOptionValue={({ option }) => option.name}
              name={WalletDepositCryptoFormFields.PaymentMethod}
              onChange={handleOnPaymentMethodChange}
              options={paymentMethodOptions}
              validation={{
                required: true,
              }}
            />
          </Form.Group>
        </Grid.Cell>
        <Grid.Cell>
          <MethodComponent />
        </Grid.Cell>
      </Grid>
    </Form>
  );
};

export type { WalletDepositCryptoProps };
export { WalletDepositCrypto };
