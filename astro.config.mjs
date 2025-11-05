import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
  site: 'https://astroseoblog.com',
  trailingSlash: 'never', // Enforce consistent URLs without trailing slashes
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    mdx(),
    react(),
    markdoc(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          es: 'es-ES',
          fr: 'fr-FR',
          de: 'de-DE',
          ja: 'ja-JP',
          ko: 'ko-KR',
          zh: 'zh-CN',
          pt: 'pt-BR',
          he: 'he-IL',
          hi: 'hi-IN',
          id: 'id-ID',
          vi: 'vi-VN',
        },
      },
      filter: (page) => !page.includes('/admin/') && !page.includes('/api/'),
    }),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
  ],
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  compressHTML: true,
  build: {
    inlineStylesheets: 'always', // Inline all stylesheets to prevent render blocking
  },
  server: {
    port: parseInt(process.env.PORT || '4321'),
    host: '0.0.0.0'
  },
  vite: {
    optimizeDeps: {
      include: [
        'lodash.debounce',
        'direction',
        '@emotion/weak-memoize'
      ],
    },
    ssr: {
      noExternal: [
        'direction',
        '@emotion/weak-memoize',
        'lodash'
      ],
    },
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
          },
        },
      },
    },
  },
  image: {
    domains: ['localhost'],
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});