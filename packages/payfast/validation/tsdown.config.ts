import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    platform: 'neutral',
    entry: 'src/index.ts',
    outDir: 'dist',
    deps: {
      neverBundle: ['node:*']
    },
    format: ['cjs', 'esm'],
    dts: true,
    exports: {
      devExports: true,
      customExports: {
        '.': {
          'node': {
            import: './dist/index.js',
            require: './dist/node/index.cjs',
            types: './dist/node/index.d.ts'
          },
          'default': {
            import: './dist/index.mjs',
            require: null,
            types: './dist/index.d.ts'
          }

        }
      }
    }
  },
  {
    platform: 'node',
    entry: 'src/index.ts',
    outDir: 'dist/node',
    deps: {
      neverBundle: ['node:*']
    },
    format: {
      cjs: {
        target: ['node20'],
      },
      esm: {
        target: ['es2015'],
      }
    },
  }
])
