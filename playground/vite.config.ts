import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import createExternal from 'vite-plugin-external'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        engine: resolve(import.meta.dirname, 'engine/index.html'),
        renderer: resolve(import.meta.dirname, 'renderer/index.html')
      }
    }
  },
  plugins: [
    createExternal({
      externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        '@alifd/next': 'Next'
      }
    })
  ]
})
