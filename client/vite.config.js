import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://aspire-nex-task2-startup-boardbackend-5c55bjwwq.vercel.app/',
        secure: false,
      },
    },
  },
  plugins: [react()],
});
