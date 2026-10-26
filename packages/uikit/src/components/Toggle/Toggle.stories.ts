import { type Meta, type StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Toggle } from './Toggle';

const meta: Meta<typeof Toggle> = {
  args: {
    children: 'Toggle description '.concat(Array(100).fill('long ').join('')),
    disabled: false,
    id: 'toggle',
    onChange: fn(),
    value: false,
  },
  component: Toggle,
  title: 'Controls/Toggle',
};

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {};
