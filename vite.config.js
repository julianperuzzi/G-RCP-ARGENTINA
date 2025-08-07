import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Usando el plugin estándar

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})