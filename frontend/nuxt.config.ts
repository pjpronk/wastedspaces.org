// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5050/api', // Accessible everywhere
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || 'Unauthorized'
    },
  },
  modules: ["@nuxt/eslint", "@nuxtjs/leaflet"],
  components: [
    "~/components/",
    "~/components/atoms/",
    "~/components/molecules/",
    "~/components/organisms/"
  ],
  css: ["/assets/styles/index.scss"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "/assets/styles/variables/index.scss" as *;'
        }
      }
    }
  }
})
