import {
  WalletBalanceOption,
  WalletPaymentMethodOption,
} from '@common/components';
import { Form, Grid } from '@rockethash/uikit';
import { type FC } from 'react';

import { useWalletData } from '../../WalletProvider';
import { useWalletSettings } from '../Wallet.hooks';
import {
  type WalletDepositCryptoForm,
  WalletDepositCryptoFormFields,
  type WalletDepositCryptoProps,
} from './WalletDepositCrypto.types';

const WalletDepositCrypto: FC<WalletDepositCryptoProps> = () => {
  const { userBalances, cryptoCurrencies, paymentMethods } = useWalletData();

  const [settings] = useWalletSettings();

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

  const handleOnSubmit = (data: WalletDepositCryptoForm) => {
    console.log(data);
  };

  return (
    <Form<WalletDepositCryptoForm>
      defaultValues={defaultValues}
      onSubmit={handleOnSubmit}
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
              options={paymentMethodOptions}
              validation={{
                required: true,
              }}
            />
          </Form.Group>
        </Grid.Cell>
      </Grid>
    </Form>
  );
};

export type { WalletDepositCryptoProps };
export { WalletDepositCrypto };
