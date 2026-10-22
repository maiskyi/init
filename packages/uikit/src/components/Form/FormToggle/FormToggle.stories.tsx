import { type Meta, type StoryObj } from '@storybook/react-vite';

import { Button } from '../../Button';
import { Toggle } from '../../Toggle';
import { Form } from '../Form';
import { FormToggle } from './FormToggle';

const handleOnSubmit = () => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
};

const meta: Meta<typeof FormToggle> = {
  args: {
    children: 'Toggle description '.concat(Array(100).fill('long ').join('')),
    className: '',
    errors: {},
    name: 'toggle',
    validation: {
      required: true,
    },
  },
  component: FormToggle,
  title: 'Forms/Toggle',
};

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  render: (args) => (
    <Form onSubmit={handleOnSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Input with label */}
        <Form.Group>
          <Form.Toggle {...args} label="Toggle input" name="toggle" />
        </Form.Group>
        <Form.Submit size="large">Submit</Form.Submit>
      </div>
    </Form>
  ),
};
