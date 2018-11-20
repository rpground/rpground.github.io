import * as firebase from 'firebase/app'

class User {
  constructor (id) {
    this.id = id
  }
}

export default {
  state: {
    user: null
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    }
  },
  actions: {
    async registerUser ({commit}, {email, password}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        let user = await firebase.auth().createUserWithEmailAndPassword(email, password)
        user = user.user
        commit('setUser', new User(user.uid))
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
      // firebase.auth().createUserWithEmailAndPassword(email, password)
      // .then(user => {
      //   commit('setUser', new User(user.uid))
      //   commit('setLoading', false)
      // })
      // .catch(error => {
      //   commit('setLoading', false)
      //   commit('setError', error.message)
      // })
    async loginUser ({commit}, {email, password}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        let user = await firebase.auth().signInWithEmailAndPassword(email, password)
        user = user.user
        commit('setUser', new User(user.uid))
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    autoLoginUser ({commit}, payload) {
      commit('setUser', new User(payload.uid))
    },
    logoutUser ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
    }
  },
  getters: {
    user (state) {
      return state.user
    },
    isUserLogin (state) {
      return state.user !== null
    }
  }
}
