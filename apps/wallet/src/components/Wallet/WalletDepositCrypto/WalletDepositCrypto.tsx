import { Form, Grid } from '@rockethash/uikit';
import { type FC } from 'react';

import { type WalletDepositCryptoProps } from './WalletDepositCrypto.types';

const WalletDepositCrypto: FC<WalletDepositCryptoProps> = ({ className }) => {
  const handleOnSubmit = (data: unknown) => {
    console.log(data);
  };

  return (
    <Form onSubmit={handleOnSubmit}>
      <Grid spacing={3}>
        <Grid.Cell>
          <Form.Group>
            <Form.Label>Your balance</Form.Label>
          </Form.Group>
        </Grid.Cell>
        <Grid.Cell>
          <Form.Group>
            <Form.Label>Payment method</Form.Label>
          </Form.Group>
        </Grid.Cell>
      </Grid>
    </Form>
  );
};

export type { WalletDepositCryptoProps };
export { WalletDepositCrypto };
