import { withThemeByDataAttribute } from '@storybook/addon-themes';
import type { Preview, ReactRenderer } from '@storybook/react-vite';

import { ThemeProvider } from '../src';

const preview: Preview = {
  decorators: [
    withThemeByDataAttribute<ReactRenderer>({
      themes: {
        DuckDice: 'duckdice',
        Tower: 'tower',
      },
      defaultTheme: 'duckdice',
      attributeName: 'data-theme',
    }),
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],

  parameters: {
    backgrounds: {
      options: {
        duckdice: {
          name: 'DuckDice',
          value: '#222325',
        },
      },
      default: 'duckdice',
    },
    layout: 'padded',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
