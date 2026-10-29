import { WalletBalanceOption } from '@common/components';
import { Form, Grid } from '@rockethash/uikit';
import { type FC } from 'react';

import { useWalletData } from '../../WalletProvider';
import {
  type WalletDepositCryptoForm,
  WalletDepositCryptoFormFields,
  type WalletDepositCryptoProps,
} from './WalletDepositCrypto.types';

const WalletDepositCrypto: FC<WalletDepositCryptoProps> = () => {
  const { cryptoCurrencies } = useWalletData();

  const handleOnSubmit = (data: WalletDepositCryptoForm) => {
    console.log(data);
  };

  return (
    <Form<WalletDepositCryptoForm>
      defaultValues={{
        [WalletDepositCryptoFormFields.Balance]: cryptoCurrencies[0].symbol,
        [WalletDepositCryptoFormFields.PaymentMethod]: '',
      }}
      onSubmit={handleOnSubmit}
    >
      <Grid spacing={3}>
        <Grid.Cell>
          <Form.Group>
            <Form.Label>Your balance</Form.Label>
            <Form.Select
              getOptionLabel={(params) => <WalletBalanceOption {...params} />}
              getOptionValue={({ option }) => option.symbol}
              name={WalletDepositCryptoFormFields.Balance}
              options={cryptoCurrencies}
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
              name={WalletDepositCryptoFormFields.PaymentMethod}
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

export type { WalletDepositCryptoProps };
export { WalletDepositCrypto };
