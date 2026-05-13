import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./lib/index.tsx'],
  platform: 'neutral',
  dts: true,
  inputOptions: {
    transform: {
        jsx: 'react-jsx',
    }
  },
  exports: {
    devExports: true
  }
})