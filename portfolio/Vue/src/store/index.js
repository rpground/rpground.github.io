import Vue from 'vue'
import Vuex from 'vuex'
import products from './modules/products'
import articles from './modules/articles'
import codes from './modules/codes'
import diarys from './modules/diarys'
import user from './modules/user'
import common from './modules/common'
import review from './modules/review'
import base from './modules/base'
import comment from './modules/comment'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    products,
    articles,
    codes,
    diarys,
    user,
    common,
    base,
    review,
    comment
  }
})
