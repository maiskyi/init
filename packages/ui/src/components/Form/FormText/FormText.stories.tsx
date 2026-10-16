import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Toggle } from "../../Toggle";
import { Form } from "../Form";
import { FormText } from "./FormText";

const meta: Meta<typeof FormText> = {
  title: "Forms/Text",
  component: FormText,
};

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  render: (args) => (
    <Form onSubmit={fn()}>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Input with label */}
        <Form.Group>
          <Form.Label>Text input</Form.Label>
          <Form.Text {...args} />
        </Form.Group>
        {/* Input with label and addons */}
        <Form.Group>
          <Form.Label>Text input with addons</Form.Label>
          <Form.InputGroup>
            <Form.Addon position="before">
              <Toggle />
            </Form.Addon>
            <Form.Text {...args} />
            <Form.Addon position="after">After</Form.Addon>
          </Form.InputGroup>
        </Form.Group>
      </div>
    </Form>
  ),
};
