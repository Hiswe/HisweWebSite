import path from 'path'

import pkg from './package.json'

const NAME = `hiswe website`

export default {
  router: {
    middleware: `reset-form`,
  },
  head: {
    titleTemplate: 'Hiswe – %s',
    meta: [
      { charset: `utf-8` },
      { name: `viewport`, content: `width=device-width, initial-scale=1` },
      { 'http-equiv': `X-UA-Compatible`, content: `IE=edge` },
      { hid: `author`, name: `author`, content: pkg.author },
      { hid: `description`, name: `description`, content: pkg.description },
      // open graph
      { hid: `og:title`, name: `og:title`, content: NAME },
      { hid: `og:type`, name: `og:type`, content: `website` },
      {
        hid: `og:description`,
        name: `og:description`,
        content: pkg.description,
      },
      { hid: `og:url`, name: `og:url`, content: pkg.homepage },
      // twitter
      { hid: `twitter:card`, name: `twitter:card`, content: `summary` },
      { hid: `twitter:site`, name: `twitter:site`, content: `@hiswehalya` },
      {
        hid: `twitter:creator`,
        name: `twitter:creator`,
        content: `@hiswehalya`,
      },
    ],
    link: [{ rel: `icon`, type: `image/png`, href: `/favicon.png` }],
  },
  loading: {
    color: `hsl(332, 100%, 50%)`,
    height: `5px`,
  },
  css: [
    `@/nuxt-assets/css/global.scss`,
    `@/nuxt-assets/css/page-transitions.scss`,
  ],
  modules: [],
  plugins: [
    `@/nuxt-plugins/global-components.js`,
    { src: `@/nuxt-plugins/browser.js`, ssr: false },
  ],
  build: {
    extend(config, { isDev, isClient }) {
      console.log(config)
    },
  },
}
