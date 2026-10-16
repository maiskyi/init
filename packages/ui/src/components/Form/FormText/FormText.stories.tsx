import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Form } from "../Form";
import { FormText } from "./FormText";

const meta: Meta<typeof FormText> = {
  title: "Forms/Text",
  component: FormText,
  render: (args) => (
    <Form onSubmit={fn()}>
      <Form.Text {...args} />
    </Form>
  ),
};

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  args: {
    children: "Click me",
  },
};
