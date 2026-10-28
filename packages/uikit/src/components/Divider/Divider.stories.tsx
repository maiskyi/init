import { type Meta, type StoryObj } from '@storybook/react-vite';

import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  args: {
    className: 'divider',
    orientation: 'horizontal',
    thickness: 1,
  },
  component: Divider,
  title: 'Layout/Divider',
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
