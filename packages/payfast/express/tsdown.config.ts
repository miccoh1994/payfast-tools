import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    platform: 'neutral',
    entry: 'lib/express.ts',
    outDir: 'dist',
    deps: {
      neverBundle: ['node:*', 'express', '@ngrok/ngrok']
    },
    format: ['cjs', 'esm'],
    dts: true,
    exports: {
      devExports: true,
      customExports: {
        '.': {
          'default': {
            import: './dist/express.mjs',
            require: null,
            types: './dist/express.d.mts'
          },
          'node': {
            import: './dist/node/express.mjs',
            require: './dist/node/express.cjs',
            types: './dist/node/express.d.ts'
          }
        }
      }
    }
  },
  {
    platform: 'node',
    entry: 'lib/express.ts',
    outDir: 'dist/node',
    deps: {
      neverBundle: ['node:*', '@ngrok/ngrok']
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
