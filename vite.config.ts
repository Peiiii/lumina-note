import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  // 配置Tailwind CSS支持
  css: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3001, // 使用不同于Next.js的端口
    open: true,
  },
  // 配置TypeScript
  optimizeDeps: {
    esbuildOptions: {
      tsconfig: 'tsconfig.vite.json',
    },
  },
}) 