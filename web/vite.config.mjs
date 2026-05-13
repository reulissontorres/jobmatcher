import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Development server: set port to 3000 to match existing API CORS policy
// and proxy `/api` requests to the backend running on port 5297.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5297',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
