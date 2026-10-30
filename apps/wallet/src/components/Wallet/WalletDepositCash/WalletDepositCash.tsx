import { WalletBalanceOption } from '@common/components';
import { Form, Grid } from '@rockethash/uikit';
import { type FC } from 'react';

import { useWalletData } from '../../WalletProvider';
import {
  type WalletDepositCashForm,
  WalletDepositCashFormFields,
  type WalletDepositCashProps,
} from './WalletDepositCash.types';

const WalletDepositCash: FC<WalletDepositCashProps> = () => {
  const { userBalances, fiatCurrencies } = useWalletData();

  const handleOnSubmit = (data: WalletDepositCashForm) => {
    console.log(data);
  };

  return (
    <Form<WalletDepositCashForm>
      defaultValues={{
        [WalletDepositCashFormFields.Balance]: fiatCurrencies[0].symbol,
        [WalletDepositCashFormFields.PaymentMethod]: '',
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
              name={WalletDepositCashFormFields.Balance}
              options={fiatCurrencies}
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
              name={WalletDepositCashFormFields.PaymentMethod}
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

export type { WalletDepositCashProps };
export { WalletDepositCash };
