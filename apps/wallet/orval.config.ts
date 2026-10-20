import { execSync } from 'node:child_process';
import path from 'node:path';

import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    hooks: {
      afterAllFilesWrite: (initialFiles) => {
        if (!Array.isArray(initialFiles)) return;
        const files = initialFiles.map((file) =>
          path.relative(process.cwd(), file),
        );
        execSync(`biome check --write ${files.join(' ')}`, {
          stdio: 'inherit',
        });
      },
    },
    input: {
      target: path.resolve(__dirname, './src/_services/api/openapi.json'),
    },
    output: {
      client: 'react-query',
      mock: false,
      mode: 'tags-split',
      override: {
        enumGenerationType: 'enum',
        // header: () =>
        //   [
        //     '/* eslint-disable import-x/no-duplicates */',
        //     '/* eslint-disable @typescript-eslint/ban-ts-comment */',
        //     '// @ts-nocheck - generated file',
        //     '',
        //   ].join('\n'),
        mutator: {
          name: 'apiInstance',
          path: './src/_services/api/utils/api-instance/api-instance.utils.ts',
        },
        namingConvention: {
          enum: 'PascalCase',
        },
        query: {
          queryOptions: {
            name: 'apiQueryOptions',
            path: './src/_services/api/utils/api-query-options/api-query-options.utils.ts',
          },
          useInfinite: true,
          useInfiniteQueryParam: 'pagination[page]',
        },
      },
      target: path.resolve(
        __dirname,
        './src/_services/api/__generated__/client.ts',
      ),
    },
  },
});
