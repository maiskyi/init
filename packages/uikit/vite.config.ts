import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const isStorybook = process.argv.some((arg) => arg.includes('storybook'));

export default defineConfig({
  build: isStorybook
    ? undefined
    : {
        emptyOutDir: false,
        lib: {
          entry: resolve(rootDir, 'src/index.ts'),
          fileName: 'index',
          formats: ['es'],
        },
        rolldownOptions: {
          external: [
            'classnames',
            'react',
            'react-dom',
            'react/compiler-runtime',
            'react/jsx-runtime',
          ],
        },
      },
  plugins: [
    svgr(),
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
  ],
});
