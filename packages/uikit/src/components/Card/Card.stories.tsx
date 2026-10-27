import { type Meta, type StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Card } from './Card';

const meta: Meta<typeof Card> = {
  args: {
    children: <div style={{ height: 100 }} />,
    className: 'card',
    glow: 'none',
    onClick: fn(),
    outline: false,
  },
  component: Card,
  title: 'Surfaces/Card',
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
