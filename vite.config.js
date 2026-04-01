import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    

  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 8045,
    host: true,
    allowedHosts: [
      'clubmedsaeannecy.servemp3.com',
      '51.83.36.122.nip.io'
    ]
  }
})
