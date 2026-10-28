import { type Meta, type StoryObj } from '@storybook/react-vite';
import { type CSSProperties, type PropsWithChildren } from 'react';

import { Grid } from './Grid';

const CELL_CONTENT_STYLE: CSSProperties = {
  background: 'var(--buttons-layer-orange-default)',
  borderRadius: 4,
  color: 'var(--text-accent-white)',
  padding: 8,
  textAlign: 'center',
};

const Content = ({ children }: PropsWithChildren) => (
  <div style={CELL_CONTENT_STYLE}>{children}</div>
);

const meta: Meta<typeof Grid> = {
  args: {
    spacing: 2,
  },
  argTypes: {
    colSpacing: { control: { min: 0, type: 'number' } },
    rowSpacing: { control: { min: 0, type: 'number' } },
    spacing: { control: { min: 0, type: 'number' } },
  },
  component: Grid,
  parameters: {
    docs: {
      description: {
        component:
          '12-column Flexbox grid. `spacing`, `colSpacing` and `rowSpacing` multiply the theme base spacing. ' +
          '`Grid.Cell` takes `span` plus one prop per breakpoint (mobile-first, `min-width`), each `1`–`12` or `"hidden"`. ' +
          'A cell is a block box: put flex/grid layouts on a child. ' +
          'Grid styles exist only for themes with an SCSS variables map (currently `duckdice`, not `tower`).',
      },
    },
  },
  title: 'Layout/Grid',
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Grid {...args}>
      {Array.from({ length: 12 }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static list
        <Grid.Cell key={index} span={1}>
          <Content>1</Content>
        </Grid.Cell>
      ))}
    </Grid>
  ),
};

export const ResponsiveSpans: Story = {
  render: (args) => (
    <Grid {...args}>
      {Array.from({ length: 8 }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static list
        <Grid.Cell key={index} ld={3} md={4} sm={6} span={12}>
          <Content>span 12 · sm 6 · md 4 · ld 3</Content>
        </Grid.Cell>
      ))}
    </Grid>
  ),
};

export const HiddenPerBreakpoint: Story = {
  render: (args) => (
    <Grid {...args}>
      <Grid.Cell md={4} span="hidden">
        <Content>hidden · md 4</Content>
      </Grid.Cell>
      <Grid.Cell md={8} span={12}>
        <Content>span 12 · md 8</Content>
      </Grid.Cell>
      <Grid.Cell ld="hidden" span={12}>
        <Content>span 12 · ld hidden</Content>
      </Grid.Cell>
    </Grid>
  ),
};

export const Spacing: Story = {
  args: {
    colSpacing: 4,
    rowSpacing: 1,
  },
  render: (args) => (
    <Grid {...args}>
      <Grid.Cell span={6}>
        <Content>6</Content>
      </Grid.Cell>
      <Grid.Cell span={6}>
        <Content>6</Content>
      </Grid.Cell>
      <Grid.Cell span={3}>
        <Content>3</Content>
      </Grid.Cell>
      <Grid.Cell span={3}>
        <Content>3</Content>
      </Grid.Cell>
      <Grid.Cell span={6}>
        <Content>6</Content>
      </Grid.Cell>
    </Grid>
  ),
};

export const NestedGrid: Story = {
  render: (args) => (
    <Grid {...args}>
      <Grid.Cell span={8}>
        <Grid>
          <Grid.Cell span={6}>
            <Content>nested 6 (no spacing)</Content>
          </Grid.Cell>
          <Grid.Cell span={6}>
            <Content>nested 6 (no spacing)</Content>
          </Grid.Cell>
        </Grid>
      </Grid.Cell>
      <Grid.Cell span={4}>
        <Content>4</Content>
      </Grid.Cell>
    </Grid>
  ),
};
