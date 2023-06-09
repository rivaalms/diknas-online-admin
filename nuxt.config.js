import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s | diknas-online-admin',
    // title: 'diknas-online-admin',
    htmlAttrs: {
      lang: 'id',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/axios.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  router: {
    middleware: ['auth']
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/dotenv'
  ],

  auth: {
    cookie: {
      prefix: 'auth.admin.'
    },
    localStorage: {
      prefix: 'auth.admin.'
    },
    strategies: {
      local: {
        // cookie: {
        //   cookie: {
        //     name: 'admin',
        //   },
        // },
        endpoints: {
          login: { url: '/admin/login', method: 'post', propertyName: 'data' },
          logout: { url: '/admin/logout', method: 'post' },
          user: { url: '/admin/getSelf', method: 'get', propertyName: 'data' }
        },
        tokenRequired: true,
        tokenType: 'Bearer'
      }
    },
    redirect: {
      login: '/login',
      logout: '/',
      home: '/'
    }
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: `${process.env.DIKNAS_ONLINE_API_URL}`,
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
      dark: false,
      themes: {
        light: {
          primary: colors.blue.accent3,
          accent: colors.red.accent2,
          secondary: "#ADB5BD",
          info: colors.cyan.lighten1,
          warning: colors.amber.darken3,
          error: colors.red.base,
          success: colors.green.darken2,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  env: {
    DIKNAS_ONLINE_API_URL: 'http://diknas-online-api.test'
  },

  // NOTE: don't forget to delete this when stepping up to production
  server: {
    port: 3200
  }
}
