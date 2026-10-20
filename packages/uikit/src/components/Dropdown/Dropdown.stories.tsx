import { type Meta, type StoryObj } from '@storybook/react-vite';
import { type CSSProperties } from 'react';

import { Button } from '../Button';
import { Dropdown } from './Dropdown';
import { type DropdownPlacement } from './Dropdown.types';

const JUSTIFY_CONTENT: Partial<
  Record<DropdownPlacement, CSSProperties['justifyContent']>
> = {
  'bottom-center': 'center',
  'bottom-left': 'flex-start',
  'bottom-right': 'flex-end',
  'top-center': 'center',
  'top-left': 'flex-start',
  'top-right': 'flex-end',
} as const;

const meta: Meta<typeof Dropdown> = {
  args: {
    breakpoint: 'sm',
    placement: 'bottom-right',
  },
  component: Dropdown,
  render: ({ placement = 'bottom-right', ...args }) => (
    <div
      style={{
        display: 'flex',
        justifyContent: JUSTIFY_CONTENT[placement],
      }}
    >
      <Dropdown placement={placement} {...args}>
        <Dropdown.Toggle>
          <Button size="large">
            Toggle
            <Dropdown.ToggleArrow />
          </Button>
        </Dropdown.Toggle>
        <Dropdown.Content>
          <Dropdown.Header>Header</Dropdown.Header>
          <Dropdown.Menu>
            <Dropdown.MenuItem active>Item 1</Dropdown.MenuItem>
            <Dropdown.MenuDivider />
            <Dropdown.MenuItem>Item 2</Dropdown.MenuItem>
            <Dropdown.MenuDivider />
            <Dropdown.MenuItem>Item 3</Dropdown.MenuItem>
          </Dropdown.Menu>
        </Dropdown.Content>
      </Dropdown>
    </div>
  ),
  title: 'Navigation/Dropdown',
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
