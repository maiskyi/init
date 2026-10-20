import { withThemeByDataAttribute } from '@storybook/addon-themes';
import type { Preview, ReactRenderer } from '@storybook/react-vite';

import { ThemeProvider } from '../src';

const preview: Preview = {
  decorators: [
    withThemeByDataAttribute<ReactRenderer>({
      attributeName: 'data-theme',
      defaultTheme: 'duckdice',
      themes: {
        DuckDice: 'duckdice',
        Tower: 'tower',
      },
    }),
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],

  parameters: {
    backgrounds: {
      default: 'duckdice',
      options: {
        duckdice: {
          name: 'DuckDice',
          value: '#222325',
        },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'padded',
  },
};

export default preview;
