import { type Meta, type StoryObj } from '@storybook/react-vite';

import { FiatIcon } from './FiatIcon';

const meta: Meta<typeof FiatIcon> = {
  args: {
    className: 'fiat-icon',
    name: 'AED',
    size: 48,
  },
  component: FiatIcon,
  title: 'Icons/Fiat',
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
