import type { Meta, StoryObj } from "@storybook/react-vite";

import { Select } from "./Select";

interface Option {
  value: number;
  label: string;
}

const options: Array<Option> = Array.from({ length: 10 }, (_, index) => ({
  value: index,
  label: `Option ${index}`,
}));

const meta: Meta<typeof Select<Option>> = {
  title: "Controls/Select",
  component: Select,
  args: {
    options,
    value: options[0]?.value,
    getOptionValue: ({ value }) => value,
    getOptionLabel: ({ label }) => label,
  },
};

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {};
