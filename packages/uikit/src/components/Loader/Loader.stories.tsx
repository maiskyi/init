import { type Meta, type StoryObj } from '@storybook/react-vite';

import { Loader } from './Loader';

const meta: Meta<typeof Loader> = {
  args: {
    variant: 'flashing-dots',
  },
  component: Loader,
  decorators: [
    (Story) => (
      <div style={{ color: 'white', paddingLeft: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {};
