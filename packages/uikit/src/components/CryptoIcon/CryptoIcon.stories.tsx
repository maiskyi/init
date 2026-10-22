import { type Meta, type StoryObj } from '@storybook/react-vite';

import { CryptoIcon } from './CryptoIcon';

const meta: Meta<typeof CryptoIcon> = {
  args: {
    className: 'crypto-icon',
    name: 'AAVE',
    size: 48,
  },
  component: CryptoIcon,
  title: 'Icons/Crypto',
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
