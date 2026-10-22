import { type Meta, type StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Toggle } from '../../Toggle';
import { Form } from '../Form';
import { FormSelect } from './FormSelect';

interface Option {
  label: string;
  value: string;
}

const OPTIONS: Option[] = Array.from({ length: 10 }, (_, index) => ({
  label: `Option ${index + 1}`,
  value: `option${index + 1}`,
}));

const meta: Meta<typeof FormSelect<Option>> = {
  args: {
    className: '',
    getOptionLabel: (option) => option.label,
    getOptionValue: (option) => option.value,
    name: 'select',
    options: OPTIONS,
    placeholder: 'Select an option...',
    validation: {
      required: true,
    },
  },
  component: FormSelect,
  title: 'Forms/Select',
};

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  render: (args) => (
    <Form onSubmit={fn()}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Input with label */}
        <Form.Group>
          <Form.Label>Select input</Form.Label>
          <Form.Select {...args} label="Select input" name="simple" />
        </Form.Group>
        {/* Input with label and addons */}
        <Form.Group>
          <Form.Label>Select input with addons</Form.Label>
          <Form.InputGroup>
            <Form.Addon position="before">
              <Toggle />
            </Form.Addon>
            <Form.Select
              {...args}
              label="Select input with addons"
              name="addons"
            />
            <Form.Addon position="after">After</Form.Addon>
          </Form.InputGroup>
          <Form.Hint>Helper text goes here</Form.Hint>
        </Form.Group>
        {/* Input with helper text */}
        <Form.Group>
          <Form.Label>Select input with hint</Form.Label>
          <Form.Select {...args} label="Select input with hint" name="hint" />
          <Form.Hint>Helper text goes here</Form.Hint>
        </Form.Group>
        <Form.Submit size="large">Submit</Form.Submit>
      </div>
    </Form>
  ),
};
