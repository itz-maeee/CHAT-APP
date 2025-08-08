import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import daisyui from 'daisyui';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});

