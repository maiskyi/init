import type { Meta, StoryObj } from '@storybook/react-vite';

import { Select } from './Select';

interface Option {
  label: string;
  value: number;
}

const options: Array<Option> = Array.from({ length: 10 }, (_, index) => ({
  label: `Option ${index}`,
  value: index,
}));

const meta: Meta<typeof Select<Option>> = {
  args: {
    getOptionLabel: ({ label }) => label,
    getOptionValue: ({ value }) => value,
    options,
    value: options[0]?.value,
  },
  component: Select,
  title: 'Controls/Select',
};

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {};
