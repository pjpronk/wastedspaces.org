// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      BACKEND_URL: process.env.BACKEND_URL || "http://localhost:5050/api", // Accessible everywhere
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || "Unauthorized",
      GOOGLE_MAPS_MAP_ID: process.env.GOOGLE_MAPS_MAP_ID || "",
      // Firebase configuration
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || "",
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || "",
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || "",
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || "",
      FIREBASE_MESSAGING_SENDER_ID:
        process.env.FIREBASE_MESSAGING_SENDER_ID || "",
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || ""
    }
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
  },
  plugins: ["~/plugins/relative-time", "~/plugins/api.client"]
})
