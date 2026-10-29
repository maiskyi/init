import { Button, Form, Grid } from '@rockethash/uikit';
import { type FC } from 'react';

import { type WalletDepositCryptoProps } from './WalletDepositCrypto.types';

const WalletDepositCrypto: FC<WalletDepositCryptoProps> = ({ className }) => {
  const handleOnSubmit = (data: unknown) => {
    console.log(data);
  };

  return (
    <Form onSubmit={handleOnSubmit}>
      <Grid>
        <Grid.Cell></Grid.Cell>
        <Grid.Cell></Grid.Cell>
      </Grid>
    </Form>
  );
};

export type { WalletDepositCryptoProps };
export { WalletDepositCrypto };
