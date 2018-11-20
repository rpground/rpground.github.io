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
    this.$store.dispatch('fetchProduct')
  }
})
