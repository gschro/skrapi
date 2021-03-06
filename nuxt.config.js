
export default {
  mode: 'spa',
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  server: {
    port: 8000, // default: 3000
  },
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/proxy',
    'nuxt-buefy',
    ['nuxt-fontawesome', {
      component: 'fa',
      imports: [
        {
          set: '@fortawesome/free-solid-svg-icons',
          icons: [
            'faPlus',
            'faRedoAlt',
            'faTags',
            'faUser'
          ]
        },
        {
          set: '@fortawesome/free-regular-svg-icons',
          icons: ['faHeart']
        }
      ]
    }],
  ],
  plugins: [
    '@/plugins/axios.js',
    '@/plugins/ckeditor.js',
    '@/plugins/vjsoneditor.js',
    '@/plugins/skrapi.js'
  ],
  auth: {
    redirect: {
      login: '/auth/sign-in',
      logout: '/',
      callback: '/auth/sign-in',
      home: '/'
    },
    strategies: {
      local: {
        endpoints: {
          login: { url: '/auth/local', method: 'post', propertyName: 'jwt' },
          logout: false,
          user: { url: '/users/me', method: 'get', propertyName: false }
        }
      }
    }
  },
  env: {
    EDIT_PATH: process.env.EDIT_PATH,
  },
  axios: {
    baseURL: process.env.BASE_URL
  },
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      pathRewrite: {
        '^/api' : '/'
        }
      }
    },
  publicRuntimeConfig: {
    baseURL: process.env.BASE_URL,
    // editer: process.env.EDIT_PATH
  }
}
