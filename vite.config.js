import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'engagement-wish-indication',
      transform(code, id) {
        if (!id.endsWith('/src/App.jsx')) return null
        return {
          code: code.replace(
            "setNotice('Your wish is visible to everyone ❤️')",
            "setNotice('Your wish became part of our special day🤍')"
          ),
          map: null,
        }
      },
    },
  ],
})