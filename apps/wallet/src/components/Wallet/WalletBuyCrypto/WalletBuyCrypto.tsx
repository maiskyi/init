import { WalletBalanceOption } from '@common/components';
import { Form, Grid } from '@rockethash/uikit';
import { type FC } from 'react';

import { useWalletData } from '../../WalletProvider';
import {
  type WalletBuyCryptoForm,
  WalletBuyCryptoFormFields,
  type WalletBuyCryptoProps,
} from './WalletBuyCrypto.types';

const WalletBuyCrypto: FC<WalletBuyCryptoProps> = () => {
  const { userBalances, cryptoCurrencies } = useWalletData();

  const handleOnSubmit = (data: WalletBuyCryptoForm) => {
    console.log(data);
  };

  return (
    <Form<WalletBuyCryptoForm>
      defaultValues={{
        [WalletBuyCryptoFormFields.Balance]: cryptoCurrencies[0].symbol,
        [WalletBuyCryptoFormFields.PaymentMethod]: '',
      }}
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
              name={WalletBuyCryptoFormFields.Balance}
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
              getOptionLabel={() => ''}
              getOptionValue={() => ''}
              name={WalletBuyCryptoFormFields.PaymentMethod}
              options={[]}
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

export type { WalletBuyCryptoProps };
export { WalletBuyCrypto };
