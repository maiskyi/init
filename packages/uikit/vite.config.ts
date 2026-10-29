import { resolve } from 'node:path';

import { themeCssSplit } from '@repo/vite';
import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ command: _ }) => {
  const isStorybook = process.argv.some((arg) => arg.includes('storybook'));

  return {
    build: isStorybook
      ? undefined
      : {
          emptyOutDir: false,
          lib: {
            entry: resolve(import.meta.dirname, 'src/index.ts'),
            fileName: 'index',
            formats: ['es'],
          },
          rolldownOptions: {
            external: [
              'classnames',
              'react',
              'react-compiler-runtime',
              'react-dom',
              'react/jsx-runtime',
            ],
          },
        },
    plugins: [
      svgr(),
      react(),
      babel({
        presets: [reactCompilerPreset({ target: '18' })],
      }),
      ...(isStorybook ? [] : [themeCssSplit()]),
    ],
  };
});
