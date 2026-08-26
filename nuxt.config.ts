// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@pinia/nuxt", "@nuxtjs/tailwindcss"],
  css: ["~/assets/css/main.scss"],
  runtimeConfig: {
    public: {
      // apiBase: "http://localhost:8000",
      apiBase: "https://api-open-ticket.squadmanager.id",
    },
  },
  app: {
    head: {
      title: "Open Ticket",
      htmlAttrs: { lang: "id" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "/favicon.png",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
        },
      ],
    },
  },
});
