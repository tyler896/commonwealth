import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const commerceTarget = env.VITE_COMMERCE_PROXY_TARGET || 'http://localhost:3001'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        // Optional local commerce API — shop falls back to static catalog if down
        '/api': {
          target: commerceTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
