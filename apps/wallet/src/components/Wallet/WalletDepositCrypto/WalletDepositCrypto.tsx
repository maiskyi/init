import { Form, Grid } from '@rockethash/uikit';
import { type FC } from 'react';

import { useWalletData } from '../../WalletProvider';
import { type WalletDepositCryptoProps } from './WalletDepositCrypto.types';

const WalletDepositCrypto: FC<WalletDepositCryptoProps> = () => {
  const { cryptoCurrencies } = useWalletData();

  const handleOnSubmit = (data: unknown) => {
    console.log(data);
  };

  return (
    <Form onSubmit={handleOnSubmit}>
      <Grid spacing={3}>
        <Grid.Cell>
          <Form.Group>
            <Form.Label>Your balance</Form.Label>
            <Form.Select
              getOptionLabel={({ name }) => name}
              getOptionValue={({ symbol }) => symbol}
              name="balance"
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
              name="balance"
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
