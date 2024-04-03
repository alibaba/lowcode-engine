import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        engine: resolve(import.meta.dirname, 'engine/index.html'),
        renderer: resolve(import.meta.dirname, 'renderer/index.html')
      }
    }
  }
})
