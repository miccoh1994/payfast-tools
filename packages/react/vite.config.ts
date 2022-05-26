import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsConfigPaths from 'vite-tsconfig-paths'
import dts from 'vite-plugin-dts'
console.log(resolve('lib', 'index.tsx'))
// https://vitejs.dev/config/
export default defineConfig(configEnv => ({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3333',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    }
  },
  plugins: [
    react(),
    tsConfigPaths(),
    dts({
      include: ['lib'],
      beforeWriteFile: (filePath, content) => ({
        filePath: filePath.replace('react/lib', ''),
        content,
      }),
    }),
    
  ],
  build: {
    lib: {
      entry: resolve('lib', 'index.tsx'),
      name: 'ReactFeatureFlag',
      fileName: (format) => `payfast-react.${format}.js`,
    },
    rollupOptions: {
      external: ['react'],
    },
  },
}))