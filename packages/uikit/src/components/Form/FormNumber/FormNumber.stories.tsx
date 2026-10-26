import { type Meta, type StoryObj } from '@storybook/react-vite';

import { Button } from '../../Button';
import { Toggle } from '../../Toggle';
import { Form } from '../Form';
import { FormNumber } from './FormNumber';

const handleOnSubmit = () => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
};

const meta: Meta<typeof FormNumber> = {
  args: {
    className: '',
    dataType: 'number',
    errors: {
      required: 'This field is required',
    },
    label: 'Number input',
    name: 'number',
    placeholder: 'Enter number',
    validation: {
      max: 100,
      min: 1,
      required: true,
    },
  },
  component: FormNumber,
  title: 'Forms/Number',
};

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  render: (args) => (
    <Form onSubmit={handleOnSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Input with label */}
        <Form.Group>
          <Form.Label>Number input</Form.Label>
          <Form.Number {...args} label="Number input" name="simple" />
        </Form.Group>
        {/* Input with label and addons */}
        <Form.Group>
          <Form.Label>Number input with addons</Form.Label>
          <Form.InputGroup>
            <Form.Addon position="before">
              <Toggle />
            </Form.Addon>
            <Form.Number
              {...args}
              label="Number input with addons"
              name="addons"
            />
            <Form.Addon position="after">
              <Button icon="check-circle" variant="secondary" />
            </Form.Addon>
          </Form.InputGroup>
          <Form.Hint>Helper text goes here</Form.Hint>
        </Form.Group>
        {/* Input with helper text */}
        <Form.Group>
          <Form.Label>Number input with hint</Form.Label>
          <Form.Number {...args} label="Number input with hint" name="hint" />
          <Form.Hint>Helper text goes here</Form.Hint>
        </Form.Group>
        <Form.Submit size="large">Submit</Form.Submit>
      </div>
    </Form>
  ),
};
