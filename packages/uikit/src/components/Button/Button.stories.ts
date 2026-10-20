import { type Meta, type StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  args: {
    children: 'Button',
    className: '',
    disabled: false,
    isPending: false,
    onClick: fn(),
    size: 'medium',
    type: 'button',
    variant: 'tertiary',
  },
  component: Button,
  title: 'Controls/Button',
};

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  args: {
    children: 'Click me',
  },
};
