import path from 'node:path';

import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { externalizeDeps } from 'vite-plugin-externalize-deps';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ command: _ }) => {
  return {
    plugins: [
      svgr(),
      react(),
      babel({
        presets: [
          reactCompilerPreset({
            target: '18',
          }),
        ],
      }),
      externalizeDeps({
        deps: true,
        devDeps: true,
        peerDeps: true,
      }),
    ],
    resolve: {
      alias: {
        '@common': path.resolve(__dirname, './src/_common'),
        '@services': path.resolve(__dirname, './src/_services'),
      },
    },
  };
});
