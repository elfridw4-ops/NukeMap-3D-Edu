import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DEFAULT_SITE_ORIGIN = 'https://ais-pre-fzvmzxocs5ijp3lhdhfanl-156867150624.europe-west1.run.app';

function resolveDeploymentOrigin(): string {
  const candidates = [
    process.env.VITE_SITE_URL,
    process.env.SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    process.env.APP_URL,
  ];
  for (const raw of candidates) {
    if (!raw || !raw.trim()) continue;
    let trimmed = raw.trim().replace(/\/+$/, '');
    if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = `https://${trimmed}`;
    }
    // Évite qu'une URL privée ais-dev-* bloque les robots d'aperçu social (WhatsApp, X, Discord)
    if (trimmed.includes('://ais-dev-')) {
      trimmed = trimmed.replace('://ais-dev-', '://ais-pre-');
    }
    return trimmed;
  }
  return DEFAULT_SITE_ORIGIN;
}

function resolveSiteOriginHtml(): Plugin {
  return {
    name: 'resolve-site-origin-html',
    transformIndexHtml(html) {
      const origin = resolveDeploymentOrigin();
      if (origin === DEFAULT_SITE_ORIGIN) return html;
      return html.split(DEFAULT_SITE_ORIGIN).join(origin);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), resolveSiteOriginHtml()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('react') || id.includes('scheduler')) return 'react';
          if (id.includes('maplibre-gl') || id.includes('react-map-gl')) return 'map';
          if (id.includes('@deck.gl')) return 'deck';
          if (id.includes('motion')) return 'motion';
          if (id.includes('lucide-react') || id.includes('clsx') || id.includes('tailwind-merge')) return 'vendors';
          return undefined;
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify—file watching is disabled to prevent flickering during agent edits.
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});
