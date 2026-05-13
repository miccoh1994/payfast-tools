import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    platform: 'neutral',
    entry: 'src/index.ts',
    outDir: 'dist',
    format: ['cjs', 'esm'],
    dts: true,
    exports: {
      customExports: {
        '.': {
          'default': {
            import: null,
            require: null,
            types: './dist/index.d.ts'
          }
        },
      }
    }
  },
  {
    platform: 'node',
    entry: 'src/index.ts',
    outDir: 'dist/node',
    format: ['cjs', 'esm'],
    dts: true,
    exports: false,
  }
])
