import { type Meta, type StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  args: {
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lobortis, odio egestas pulvinar sodales.',
    className: 'alert',
    variant: 'default',
  },
  component: Alert,
  title: 'Feedback/Alert',
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Clickable: Story = {
  args: {
    onClick: fn(),
  },
};
