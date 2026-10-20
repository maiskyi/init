import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from './Input';

const meta: Meta<typeof Input> = {
  component: Input,
  title: 'Controls/Input',
};

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {};
