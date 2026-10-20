import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Controls/Input',
  component: Input,
};

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {};
