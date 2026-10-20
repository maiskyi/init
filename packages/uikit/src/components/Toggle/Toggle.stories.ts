import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Toggle } from './Toggle';

const meta: Meta<typeof Toggle> = {
  title: 'Controls/Toggle',
  component: Toggle,
  args: {
    onChange: fn(),
    value: false,
    disabled: false,
    id: 'toggle',
  },
};

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {};
