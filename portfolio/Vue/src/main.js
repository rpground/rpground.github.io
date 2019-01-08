import Vue from 'vue'
import App from './App'
import router from './router'
import AddReviewComponent from '@/components/Common/addReview'
import store from './store'
import Vuetify from 'vuetify'
import * as firebase from 'firebase/app'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)
Vue.component('app-add-review', AddReviewComponent)
Vue.config.productionTip = false

const mylib = {
  bbCodeToTag: (value) => {
    let des = value.replace(/</g, '"<"').replace(/>/g, '">"')
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
    return des
  },
  tagToBbCode: (value) => {
    let des = value.replace(/<b>/g, '[b]').replace(/<\/b>/g, '[/b]')
    des = des.replace(/<p class="notes"><span>/g, '[notes]').replace(/<\/span><\/p>/g, '[/notes]')
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
    this.$store.dispatch('fetchDiary')
    this.$store.dispatch('fetchProduct')
    this.$store.dispatch('fetchComment')
    this.$store.dispatch('fetchReview')
    this.$store.dispatch('fetchBase')
  }
})
