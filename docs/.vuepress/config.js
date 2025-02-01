import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress/cli'
import { viteBundler } from '@vuepress/bundler-vite'

export default defineUserConfig({
  lang: 'en-US',

  title: 'Alpine-forms',
  description: 'An AlpineJS forms Library',
  site: {
    base: '/alpine-forms/',
  },

  theme: defaultTheme({
    logo: '/images/hero.png',

    navbar: ['/', '/get-started'],
  }),

  bundler: viteBundler(),
})
