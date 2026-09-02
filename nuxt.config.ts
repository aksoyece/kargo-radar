// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@vite-pwa/nuxt'],
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    '~/assets/main.css',
  ],
  runtimeConfig: {
    aftershipApiKey: process.env.AFTERSHIP_API_KEY || '',
    public: {
      useAftership: process.env.NUXT_PUBLIC_USE_AFTERSHIP === 'true',
    },
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Kargo Radar',
      short_name: 'Kargo Radar',
      description: 'Farklı kargo firmalarına ait gönderilerinizi tek bir uygulama üzerinden takip edin.',
      theme_color: '#2563eb',
      background_color: '#f1f5f9',
      display: 'standalone',
      lang: 'tr',
      start_url: '/',
      icons: [
        {
          src: '/pwa-192x192.svg',
          sizes: '192x192',
          type: 'image/svg+xml',
          purpose: 'any',
        },
        {
          src: '/pwa-512x512.svg',
          sizes: '512x512',
          type: 'image/svg+xml',
          purpose: 'any maskable',
        },
      ],
    },
    workbox: {
      navigateFallback: '/',
    },
  },
  app: {
    head: {
      title: 'Kargo Radar',
      script: [
        {
          innerHTML: `(function(){try{var t=localStorage.getItem('kargo-radar-theme');if(t!=='dark'&&t!=='light')t=matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t)}catch(e){}})();`,
          type: 'text/javascript',
        },
        {
          innerHTML: `(function(){try{if('scrollRestoration' in history)history.scrollRestoration='manual';window.scrollTo(0,0)}catch(e){}})();`,
          type: 'text/javascript',
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap',
        },
      ],
      meta: [
        {
          name: 'description',
          content: 'Kargo Radar — farklı kargo firmalarına ait gönderilerinizi tek bir uygulama üzerinden takip edin.',
        },
        {
          property: 'og:title',
          content: 'Kargo Radar',
        },
        {
          property: 'og:description',
          content: 'Farklı kargo firmalarına ait gönderilerinizi tek bir uygulama üzerinden takip edin.',
        },
        {
          property: 'og:url',
          content: 'https://kargo-radar.vercel.app',
        },
        {
          name: 'theme-color',
          content: '#2563eb',
        },
      ],
    },
  },
})
