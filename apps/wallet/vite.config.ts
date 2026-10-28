import path from 'node:path';

import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ command: _ }) => {
  return {
    plugins: [
      svgr(),
      react(),
      babel({
        presets: [reactCompilerPreset()],
      }),
    ],
    resolve: {
      alias: {
        '@services': path.resolve(__dirname, './src/_services'),
      },
    },
  };
});
