import { type Meta, type StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Button } from '../../Button';
import { Toggle } from '../../Toggle';
import { Form } from '../Form';
import { FormText } from './FormText';

const meta: Meta<typeof FormText> = {
  args: {
    className: '',
    errors: {
      required: 'This field is required',
    },
    name: 'text',
    placeholder: 'Enter text',
    type: 'text',
    validation: {
      maxLength: 10,
      minLength: 3,
      pattern: /^[a-zA-Z0-9]+$/,
      required: true,
    },
  },
  component: FormText,
  title: 'Forms/Text',
};

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  render: (args) => (
    <Form onSubmit={fn()}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Input with label */}
        <Form.Group>
          <Form.Label>Text input</Form.Label>
          <Form.Text {...args} label="Text input" name="simple" />
        </Form.Group>
        {/* Input with label and addons */}
        <Form.Group>
          <Form.Label>Text input with addons</Form.Label>
          <Form.InputGroup>
            <Form.Addon position="before">
              <Toggle />
            </Form.Addon>
            <Form.Text {...args} label="Text input with addons" name="addons" />
            <Form.Addon position="after">
              <Button variant="secondary">1</Button>
            </Form.Addon>
          </Form.InputGroup>
          <Form.Hint>Helper text goes here</Form.Hint>
        </Form.Group>
        {/* Input with helper text */}
        <Form.Group>
          <Form.Label>Text input with hint</Form.Label>
          <Form.Text {...args} label="Text input with hint" name="hint" />
          <Form.Hint>Helper text goes here</Form.Hint>
        </Form.Group>
        <Form.Submit size="large">Submit</Form.Submit>
      </div>
    </Form>
  ),
};
