import { type Meta, type StoryObj } from '@storybook/react-vite';

import { Text } from './Text';
import { TEXT_SIZES, TEXT_TAGS, TEXT_WEIGHTS } from './Text.const';

const meta: Meta<typeof Text> = {
  args: {
    as: 'p',
    children: 'paragraph',
    size: 'regular',
    uppercase: false,
    weight: 'regular',
  },
  argTypes: {
    as: {
      control: 'inline-radio',
      options: TEXT_TAGS,
    },
    size: {
      control: 'inline-radio',
      options: TEXT_SIZES,
    },
    uppercase: {
      control: 'boolean',
    },
    weight: {
      control: 'inline-radio',
      options: TEXT_WEIGHTS,
    },
  },
  component: Text,
  title: 'Typography/Text',
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
      {TEXT_SIZES.map((size) => (
        <div
          key={size}
          style={{ display: 'flex', flexDirection: 'column', gap: 32 }}
        >
          {TEXT_WEIGHTS.map((weight) => (
            <Text key={weight} size={size} weight={weight}>
              {`paragraph ${size} ${weight}`}
            </Text>
          ))}
          {(size === 'small' || size === 'mini') &&
            TEXT_WEIGHTS.slice(0, 2).map((weight) => (
              <Text
                key={`${weight}-uppercase`}
                size={size}
                uppercase
                weight={weight}
              >
                {`paragraph ${size}`}
              </Text>
            ))}
        </div>
      ))}
    </div>
  ),
};
