import Vue from 'vue'
import App from './App'
import router from './router'
import AddReviewComponent from '@/components/Common/addReview'
import store from './store'
import Vuetify from 'vuetify'
import * as firebase from 'firebase/app'
import 'vuetify/dist/vuetify.min.css'
// import theme from './plugins/theme'
import colors from 'vuetify/es5/util/colors'

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
Vue.use(Vuetify)
Vue.component('app-add-review', AddReviewComponent)
Vue.config.productionTip = false

const mylib = {
  addSyntax: (code) => {
    let comments = [] // Тут собираем все каменты
    let strings = [] // Тут собираем все строки
    let res = [] // Тут собираем все RegExp
    let all = { 'C': comments, 'S': strings, 'R': res }
    let safe = { '<': '<', '>': '>', '&': '&' }

    return code
    // Маскируем HTML
    .replace(/[<>&]/g, function (m) {
      return safe[m]
    })
    // Убираем каменты
    .replace(/\/\*[\s\S]*\*\//g, function (m) {
      var l = comments.length
      comments.push(m)
      return '~~~C' + l + '~~~'
    })
    .replace(/([^\\])\/\/[^\n]*\n/g, function (m, f) {
      var l = comments.length
      comments.push(m)
      return f + '~~~C' + l + '~~~'
    })
    // Убираем regexp
    .replace(/\/(\\\/|[^\\n])*\/[gim]{0,3}/g, function (m) {
      var l = res.length
      res.push(m)
      return '~~~R' + l + '~~~'
    })
    // Убираем строки
    .replace(/([^\\])((?:'(?:\\'|[^'])*')|(?:"(?:\\"|[^"])*"))/g, function (m, f, s) {
      var l = strings.length
      strings.push(s)
      return f + '~~~S' + l + '~~~'
    })
    // Выделение слов в скобках
    // .replace(/.*\(([^)]+)\)/g,
    //   '(<span class="arg">$1</span>)')
    // Выделяем ключевые слова
    .replace(/(console|var|const|let|function|typeof|new|return|if|for|in|while|break|do|continue|switch|case)([^a-z0-9$_])/gi,
      '<span class="kwrd">$1</span>$2')
    // Выделяем ключевые слова
    .replace(/(replace|map|reduce|length|log|includes|indexOf|push|find|filter)([^a-z0-9$_])/gi,
      '<span class="methods">$1</span>$2')
      // Выделяем ключевые слова this
    .replace(/(this)([^a-z0-9$_])/gi,
      '<span class="this">$1</span>$2')
    // Выделяем скобки
    .replace(/(\{|\}|\]|\[|\|)/gi,
      '<span class="gly">$1</span>')
    // Выделяем имена функций
    .replace(/([a-z_$][a-z0-9_]*)[\s]*\(/gi,
      '<span class="func">$1</span>(')
    // Возвращаем на место каменты, строки, RegExp
    .replace(/~~~([CSR])(\d+)~~~/g, function (m, t, i) {
      return '<span class="' + t + '">' + all[t][i] + '</span>'
    })
    // Выставляем переводы строк
    .replace(/\n/g, '<br/>')
    // Табуляцию заменяем неразрывными пробелами
    .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
  },
  bbCodeToTag: (value) => {
    let des = value.replace(/</g, '"<"').replace(/>/g, '">"')
    des = des.replace(/\[fiddle\]/g, '<div style="overflow-y: hidden;"><iframe style="margin-top: -50px;" width="100%" height="300" src="').replace(/\[\/fiddle\]/g, 'embedded/js/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe></div>')
    des = des.replace(/\[fiddle100\]/g, '<div style="overflow-y: hidden;"><iframe style="margin-top: -50px;" width="100%" height="100" src="')
    des = des.replace(/\[fiddle200\]/g, '<div style="overflow-y: hidden;"><iframe style="margin-top: -50px;" width="100%" height="200" src="')
    des = des.replace(/\[fiddlehtml\]/g, '<div style="overflow-y: hidden;"><iframe width="100%" height="300" style="margin-top: -50px;" src="').replace(/\[\/fiddlehtml\]/g, 'embedded/html/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe></div>')
    des = des.replace(/\[fiddlehtml100\]/g, '<div style="overflow-y: hidden;"><iframe width="100%" height="100" style="margin-top: -50px;" src="')
    des = des.replace(/\[fiddlecss\]/g, '<div style="overflow-y: hidden;"><iframe width="100%" style="margin-top: -50px;" height="300" src="').replace(/\[\/fiddlecss\]/g, 'embedded/css/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe></div>')
    des = des.replace(/\\n\\n/g, '\\n').replace(/\\n\\n\\n/g, '\\n').replace(/\\n\\n\\n\\n/g, '\\n')
    des = des.replace(/\[p\]/g, '<p>').replace(/\[\/p\]/g, '</p>')
    des = des.replace(/\[h1\]/g, '<h3>').replace(/\[\/h1\]/g, '</h3>')
    des = des.replace(/\[h2\]/g, '<h4>').replace(/\[\/h2\]/g, '</h4>')
    des = des.replace(/\[b\]/g, '<b>').replace(/\[\/b\]/g, '</b>')
    des = des.replace(/\[u\]/g, '<u>').replace(/\[\/u\]/g, '</u>')
    des = des.replace(/\[ul\]/g, '<ul>').replace(/\[\/ul\]/g, '</ul>')
    des = des.replace(/\[ol\]/g, '<ol>').replace(/\[\/ol\]/g, '</ol>')
    des = des.replace(/\[li\]/g, '<li>').replace(/\[\/li\]/g, '</li>')
    des = des.replace(/\[sup\]/g, '<sup>').replace(/\[\/sup\]/g, '</sup>')
    des = des.replace(/\[sub\]/g, '<sub>').replace(/\[\/sub\]/g, '</sub>')
    des = des.replace(/\[a\]/g, '<a href="').replace(/\[\/a\]/g, '" target="_blank">ссылка</a>')
    des = des.replace(/\[a#\]/g, '<a name=&#34;"')
    des = des.replace(/\[-a\]/g, '<a href=&#34;#')
    des = des.replace(/\[notes\]/g, '<p class="notes"><span>').replace(/\[\/notes\]/g, '</span></p>')
    des = des.replace(/\[s\]/g, '<s>').replace(/\[\/s\]/g, '</s>')
    des = des.replace(/\[quote\]/g, '<blockquote>').replace(/\[\/quote\]/g, '</blockquote>')
    des = des.replace(/\[img\]/g, '<div><img src="').replace(/\[\/img\]/g, '"></div>')
    des = des.replace(/\[i\]/g, '<i>').replace(/\[\/i\]/g, '</i>')
    // des = mylib.addSyntax(des)
    return des
  },
  tagToBbCode: (value) => {
    let des = value.replace(/"<"/g, '<').replace(/">"/g, '>').replace(/""/g, '"').replace(/""/g, '"')
    des = des.replace(/<b>/g, '[b]').replace(/<\/b>/g, '[/b]')
    des = des.replace(/<p class="notes"><span>/g, '[notes]').replace(/<\/span><\/p>/g, '[/notes]')
    des = des.replace(/<div style="overflow-y: hidden;"><iframe style="margin-top: -50px;" width="100%" height="300" src="/g, '[fiddle]')
    des = des.replace(/<div style="overflow-y: hidden;"><iframe style="margin-top: -50px;" width="100%" height="100" src="/g, '[fiddle100]').replace(/embedded\/js\/dark\/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"><\/iframe><\/div>/g, '[/fiddle]')
    des = des.replace(/<div style="overflow-y: hidden;"><iframe style="margin-top: -50px;" width="100%" height="200" src="/g, '[fiddle200]')
    des = des.replace(/<div style="overflow-y: hidden;"><iframe width="100%" height="300" style="margin-top: -50px; src="/g, '[fiddlehtml]').replace(/embedded\/html\/dark\/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"><\/iframe><\/div>/g, '[/fiddlehtml]')
    des = des.replace(/<div style="overflow-y: hidden;"><iframe width="100%" height="100" style="margin-top: -50px;" src="/g, '[fiddlehtml100]')
    des = des.replace(/<div style="overflow-y: hidden;"><iframe width="100%" style="margin-top: -50px;" height="300" src="/g, '[fiddlecss]').replace(/embedded\/css\/dark\/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"><\/iframe><\/div>/g, '[/fiddlecss]')
    des = des.replace(/<p>/g, '[p]').replace(/<\/p>/g, '[/p]')
    des = des.replace(/<h3>/g, '[h1]').replace(/<\/h3>/g, '[/h1]')
    des = des.replace(/<h4>/g, '[h2]').replace(/<\/h4>/g, '[/h2]')
    des = des.replace(/<b>/g, '[b]').replace(/<\/b>/g, '[/b]')
    des = des.replace(/<u>/g, '[u]').replace(/<\/u>/g, '[/u]')
    des = des.replace(/<ul>/g, '[ul]').replace(/<\/ul>/g, '[/ul]')
    des = des.replace(/<ol>/g, '[ol]').replace(/<\/ol>/g, '[/ol]')
    des = des.replace(/<li>/g, '[li]').replace(/<\/li>/g, '[/li]')
    des = des.replace(/<sup>/g, '[sup]').replace(/<\/sup>/g, '[/sup]')
    des = des.replace(/<sub>/g, '[sub]').replace(/<\/sub>/g, '[/sub]')
    des = des.replace(/<a href="/g, '[a]').replace(/" target="_blank">ссылка<\/a>/g, '[/a]')
    des = des.replace(/<a name=&#34;"/g, '[a#]')
    des = des.replace(/<-a href=&#34;#/g, '[-a]')
    des = des.replace(/<s>/g, '[s]').replace(/\[\/s\]/g, '[/s]')
    des = des.replace(/<blockquote>/g, '[quote]').replace(/<\/blockquote>/g, '[/quote]')
    des = des.replace(/<div><img src="/g, '[img]').replace(/"><\/div>/g, '[/img]')
    des = des.replace(/<i>/g, '[i]').replace(/<\/i>/g, '[/i]')
    return des
  },
  install: function (Vue) {
    Object.defineProperty(Vue.prototype, 'mylib', {
      get () { return mylib }
    })
  }
}

Vue.use(mylib)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created () {
    var config = {
      apiKey: 'AIzaSyA2Oxnabus9rE5xMC5-nWOF3Iek40VGzAM',
      authDomain: 'gamebase-b0d78.firebaseapp.com',
      databaseURL: 'https://gamebase-b0d78.firebaseio.com',
      projectId: 'gamebase-b0d78',
      storageBucket: 'gamebase-b0d78.appspot.com',
      messagingSenderId: '837375153168'
    }
    firebase.initializeApp(config)
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch('autoLoginUser', user)
      }
    })
    this.$store.dispatch('fetchUser')

    if (this.$router.history.current.name === 'article') {
      this.$store.dispatch('fetchArticle')
    }
    if (this.$router.history.current.name === 'diary') {
      this.$store.dispatch('fetchDiary')
    }
    if (this.$router.history.current.name === 'product') {
      this.$store.dispatch('fetchProduct')
    }
    this.$store.dispatch('fetchArticle')
    this.$store.dispatch('fetchCode')
    this.$store.dispatch('fetchDiary')
    this.$store.dispatch('fetchProduct')
    this.$store.dispatch('fetchComment')
    this.$store.dispatch('fetchReview')
    this.$store.dispatch('fetchBase')
  }
})
