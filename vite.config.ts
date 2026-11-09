import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { staticContent, videoJsonLd } from './src/content/seo.ts';

/** Fills the markers in index.html with indexable text and the video's structured data. */
const staticHtml = () => ({
  name: 'static-html',
  transformIndexHtml: (html: string) => html.replace('<!--static-content-->', staticContent()).replace('<!--video-jsonld-->', videoJsonLd()),
});

export default defineConfig({ plugins: [react(), staticHtml()], base: './', server: { host: '127.0.0.1', port: 4311 } });
