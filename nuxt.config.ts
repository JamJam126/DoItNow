import tailwindcss from '@tailwindcss/vite'

const themeScript = `
  try {
    const saved = localStorage.getItem('doitnow:theme')
    const prefersLight = matchMedia('(prefers-color-scheme: light)').matches
    const isLight = saved === 'light' || (saved === 'system' && prefersLight)
    document.documentElement.dataset.theme = isLight ? 'light' : 'dark'
  } catch {}
`

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: 'src/',
  ssr: false,

  modules: ['nuxt-auth-utils'],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    databaseUrl: '',
    session: {
      maxAge: 60 * 60 * 24 * 30,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      title: 'DoItNow',
      meta: [{ name: 'theme-color', content: '#0a0a0a' }],
      script: [{ innerHTML: themeScript, tagPosition: 'head' }],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap',
        },
      ],
    },
  },
})
