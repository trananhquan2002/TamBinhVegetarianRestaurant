import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'
import tailwindcss from '@tailwindcss/vite'
import obfuscator from 'vite-plugin-javascript-obfuscator'
import path from 'path'
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      react(),
      tailwindcss(),
      Sitemap({
        hostname: 'https://www.chaytambinh.vn',
        dynamicRoutes: ['/', '/menu', '/contact'],
      }),
      obfuscator({
        compact: true,
        controlFlowFlattening: true,
        stringArray: true,
        stringArrayThreshold: 0.8,
      }),
    ],
    build: {
      minify: 'terser',
      sourcemap: false,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[hash].js',
          chunkFileNames: 'assets/[hash].js',
          assetFileNames: 'assets/[hash].[ext]',
        },
      },
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
