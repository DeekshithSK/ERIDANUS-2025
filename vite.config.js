import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: [
    '**/*.JPG', '**/*.JPEG', '**/*.PNG', '**/*.SVG', '**/*.WEBP', '**/*.DOCX',
    '**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.svg', '**/*.webp', '**/*.docx'
  ],
});
