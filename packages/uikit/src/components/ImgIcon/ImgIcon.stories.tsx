import { type Meta, type StoryObj } from '@storybook/react-vite';

import { ImgIcon } from './ImgIcon';

const meta: Meta<typeof ImgIcon> = {
  args: {
    className: 'img-icon',
    height: 28,
    name: 'visa',
    width: 60,
  },
  component: ImgIcon,
  title: 'Icons/Img',
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
