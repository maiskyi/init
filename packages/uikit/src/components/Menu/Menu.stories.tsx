import { type Meta, type StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Icon } from '../Icon';
import { Menu } from './Menu';

const ITEMS = ['Withdraw', 'Swap', 'Vault'] as const;

const meta: Meta<typeof Menu> = {
  args: {
    className: 'menu',
  },
  component: Menu,
  render: ({ ...args }) => (
    <div style={{ width: 468 }}>
      <Menu {...args}>
        {ITEMS.map((label, index) => (
          <Menu.Item
            active={index === 1}
            key={label}
            onClick={fn()}
            prefix={<Icon name="check-circle" />}
            suffix={<Icon name="chevron-right" />}
            {...(index === 2 && {
              as: 'a',
              href: `#${label.toLowerCase()}`,
            })}
          >
            {label}
          </Menu.Item>
        ))}
      </Menu>
    </div>
  ),
  title: 'Navigation/Menu',
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
