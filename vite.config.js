import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        gridsquare: resolve(__dirname, 'gridsquare.html'),
        horizon: resolve(__dirname, 'horizon.html'),
      }
    }
  }
})
