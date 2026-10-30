import { Card, Form, Grid, Select } from '@rockethash/uikit';
import { type FC, useState } from 'react';

import { DATA } from './WalletDepositCryptoCoins.const';

const WalletDepositCryptoCoins: FC = () => {
  const transports = DATA.availableTransports.filter(
    (transport) => transport.enabled,
  );

  const [{ transport }, setState] = useState({
    transport: transports[0].name,
  });

  const handleOnTransportChange = (transport: string | number) => {
    setState(() => ({ transport: transport as string }));
  };

  return (
    <Grid spacing={3}>
      <Grid.Cell>
        <Form.Group>
          <Form.Label>Network</Form.Label>
          <Select
            getOptionLabel={({ option }) => option.name}
            getOptionValue={({ option }) => option.name}
            onChange={handleOnTransportChange}
            options={transports}
            value={transport}
          />
        </Form.Group>
      </Grid.Cell>
      <Grid.Cell />
      <Grid.Cell>
        <Card outline>123</Card>
      </Grid.Cell>
    </Grid>
  );
};

export { WalletDepositCryptoCoins };
