import type { Meta, StoryObj } from "@storybook/react-vite";

import { fn } from "storybook/test";

import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Controls/Button",
  component: Button,
  args: {
    onClick: fn(),
    children: "Button",
    disabled: false,
    className: "",
  },
};

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  args: {
    children: "Click me",
  },
};
