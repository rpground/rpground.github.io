import Vue from 'vue'
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'

// '#202029'   colors.cyan.base
Vue.use(Vuetify, {
  theme: {
    primary: {
      base: colors.cyan.darken2,
      darken2: colors.cyan.darken4
    },
    secondary: colors.grey.darken1,
    accent: colors.shades.black,
    error: colors.red.accent3
  }
})
