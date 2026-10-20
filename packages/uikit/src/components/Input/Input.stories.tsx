import { type Meta, type StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Input } from './Input';

const meta: Meta<typeof Input> = {
  args: {
    className: '',
    disabled: false,
    id: 'input',
    invalid: false,
    name: 'input',
    onBlur: fn(),
    onChange: fn(),
    placeholder: 'Input',
    readOnly: false,
    type: 'text',
    value: '',
  },
  component: Input,
  title: 'Controls/Input',
};

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {};
