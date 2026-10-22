import { type Meta, type StoryObj } from '@storybook/react-vite';

import { Icon } from './Icon';

const meta: Meta<typeof Icon> = {
  args: {
    name: 'chevron-down',
  },
  component: Icon,
  decorators: [
    (Story) => (
      <div style={{ color: 'white' }}>
        <Story />
      </div>
    ),
  ],
  title: 'Icons/Icon',
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
