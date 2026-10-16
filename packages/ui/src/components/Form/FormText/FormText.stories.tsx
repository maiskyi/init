import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Form } from "../Form";
import { FormText } from "./FormText";

const meta: Meta<typeof FormText> = {
  title: "Forms/Text",
  component: FormText,
  render: (args) => (
    <Form onSubmit={fn()}>
      <Form.Group>
        <Form.Label>Text input</Form.Label>
        <Form.InputGroup>
          <Form.Addon position="before">Before</Form.Addon>
          <Form.Text {...args} />
          <Form.Addon position="after">After</Form.Addon>
        </Form.InputGroup>
      </Form.Group>
    </Form>
  ),
};

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {};
