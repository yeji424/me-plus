import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr';
import { fileURLToPath } from 'url';
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    svgr(),  
    react()
  ],
    resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
})
