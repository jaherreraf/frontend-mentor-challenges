import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
              '@': fileURLToPath(new URL('./src', import.meta.url))
            }
    }
  }
});
