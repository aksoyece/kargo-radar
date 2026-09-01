// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
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
  app: {
    head: {
      title: 'Paket Dedektifi',
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
          href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=Space+Grotesk:wght@600;700&display=swap',
        },
      ],
      meta: [
        {
          name: 'description',
          content: 'Paket Dedektifi — farklı kargo firmalarına ait gönderilerinizi tek bir uygulama üzerinden takip edin.',
        },
        {
          name: 'theme-color',
          content: '#1c2430',
        },
      ],
    },
  },
})
