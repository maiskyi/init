import { type Meta, type StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Select } from './Select';

interface Option {
  label: string;
  value: number;
}

const options: Array<Option> = Array.from({ length: 10 }, (_, index) => ({
  label: `Option ${index + 1}`,
  value: index,
}));

const meta: Meta<typeof Select<Option>> = {
  args: {
    disabled: false,
    getOptionLabel: ({ label }) => label,
    getOptionValue: ({ value }) => value,
    invalid: false,
    onChange: fn(),
    options,
    placeholder: 'Select an option...',
    size: 'medium',
    value: options[0]?.value,
  },
  component: Select,
  title: 'Controls/Select',
};

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {};
