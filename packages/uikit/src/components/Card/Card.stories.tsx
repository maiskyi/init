import { type Meta, type StoryObj } from '@storybook/react-vite';

import { Card } from './Card';

const meta: Meta<typeof Card> = {
  args: {
    className: 'card',
  },
  component: Card,
  decorators: [
    (Story) => (
      <div style={{ color: 'white' }}>
        <Story />
      </div>
    ),
  ],
  title: 'Cards/Card',
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
