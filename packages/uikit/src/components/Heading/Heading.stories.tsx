import { type Meta, type StoryObj } from '@storybook/react-vite';

import { Heading } from './Heading';
import { HEADING_TAGS, HEADING_WEIGHTS } from './Heading.const';

const meta: Meta<typeof Heading> = {
  args: {
    as: 'h1',
    children: 'heading',
    weight: 'semibold',
  },
  argTypes: {
    as: {
      control: 'inline-radio',
      options: HEADING_TAGS,
    },
    weight: {
      control: 'inline-radio',
      options: HEADING_WEIGHTS,
    },
  },
  component: Heading,
  title: 'Typography/Heading',
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Specimen: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 64 }}>
      {HEADING_TAGS.map((tag) => (
        <div
          key={tag}
          style={{ display: 'flex', flexDirection: 'column', gap: 32 }}
        >
          {HEADING_WEIGHTS.map((weight) => (
            <Heading as={tag} key={weight} weight={weight}>
              {`${tag} ${weight}`}
            </Heading>
          ))}
        </div>
      ))}
    </div>
  ),
};
