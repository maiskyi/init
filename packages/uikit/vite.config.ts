import { resolve } from 'node:path';

import { themeCssSplit } from '@repo/vite';
import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { externalizeDeps } from 'vite-plugin-externalize-deps';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ command: _ }) => {
  const isStorybook = process.argv.some((arg) => arg.includes('storybook'));

  const plugins = isStorybook
    ? []
    : [
        themeCssSplit(),
        externalizeDeps({
          deps: true,
          devDeps: true,
          peerDeps: true,
        }),
      ];

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
        },
    plugins: [
      svgr(),
      react(),
      babel({
        presets: [reactCompilerPreset({ target: '18' })],
      }),
      ...plugins,
    ],
  };
});
