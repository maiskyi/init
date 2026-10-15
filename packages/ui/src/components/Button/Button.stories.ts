import type { Meta, StoryObj } from "@storybook/react-vite";

import { fn } from "storybook/test";

import { Button } from "./Button";
import type { ButtonSize, ButtonVariant } from "./Button.types";

const sizes: ButtonSize[] = ["small", "medium", "large"];
const variants: ButtonVariant[] = ["primary", "secondary", "tertiary", "ghost"];

const meta: Meta<typeof Button> = {
  title: "Controls/Button",
  component: Button,
  argTypes: {
    size: {
      control: "radio",
      options: sizes,
    },
    variant: {
      control: "radio",
      options: variants,
    },
  },
  args: {
    onClick: fn(),
    children: "Button",
    disabled: false,
    className: "",
    size: "medium",
    variant: "tertiary",
  },
};

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  args: {
    children: "Click me",
  },
};
