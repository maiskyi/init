import { type Meta, type StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  args: {
    children: 'Toggle description '.concat(Array(100).fill('long ').join('')),
    className: '',
    disabled: false,
    id: 'checkbox',
    invalid: false,
    onChange: fn(),
    value: false,
  },
  component: Checkbox,
  title: 'Controls/Checkbox',
};

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {};
