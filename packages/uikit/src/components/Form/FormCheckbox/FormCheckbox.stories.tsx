import { type Meta, type StoryObj } from '@storybook/react-vite';

import { Form } from '../Form';
import { FormCheckbox } from './FormCheckbox';

const handleOnSubmit = () => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
};

const meta: Meta<typeof FormCheckbox> = {
  args: {
    children: 'Toggle description '.concat(Array(100).fill('long ').join('')),
    className: '',
    errors: {},
    name: 'checkbox',
    validation: {
      required: true,
    },
  },
  component: FormCheckbox,
  title: 'Forms/Checkbox',
};

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  render: (args) => (
    <Form onSubmit={handleOnSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Input with label */}
        <Form.Group>
          <Form.Checkbox {...args} label="Checkbox input" name="checkbox" />
        </Form.Group>
        <Form.Submit size="large">Submit</Form.Submit>
      </div>
    </Form>
  ),
};
