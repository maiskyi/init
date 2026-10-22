import { type Meta, type StoryObj } from '@storybook/react-vite';

import { PaymentMethodIcon } from './PaymentMethodIcon';

const meta: Meta<typeof PaymentMethodIcon> = {
  args: {
    className: 'fiat-icon',
    name: 'ADVANCED_CASH',
    size: 48,
  },
  component: PaymentMethodIcon,
  title: 'Icons/Payment Method',
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
