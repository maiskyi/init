import { type Meta, type StoryObj } from '@storybook/react-vite';

import { ICON_CODEPOINTS, type IconName } from './__generated__/rockethash';
import { Icon } from './Icon';

import styles from './Icon.stories.module.scss';

const meta: Meta<typeof Icon> = {
  args: {
    name: 'chevron-down',
  },
  component: Icon,
  render: (args) => (
    <div className={styles['icon-gallery']}>
      <div className={styles.card}>
        <Icon {...args} />
        <span className={styles.label}>{args.name}</span>
      </div>
    </div>
  ),
  title: 'Icons/Icon',
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
  render: (args) => (
    <div className={styles['icon-gallery']}>
      {Object.keys(ICON_CODEPOINTS).map((name) => (
        <div key={name}>
          <div className={styles.card}>
            <Icon name={name as IconName} size={args.size} />
            <span className={styles.label}>{name}</span>
          </div>
        </div>
      ))}
    </div>
  ),
};
