import * as firebase from 'firebase/app'

class User {
  constructor (id) {
    this.id = id
  }
}
class Users {
  constructor (id, email, nick, city, ava) {
    this.id = id
    this.email = email
    this.nick = nick
    this.city = city
    this.ava = ava
  }
}

export default {
  state: {
    user: null,
    users: []
  },
  mutations: {
    createUser (state, payload) {
      state.users.push(payload)
    },
    loadUser (state, payload) {
      state.users = payload
    },
    setUser (state, payload) {
      state.user = payload
    }
  },
  actions: {
    async registerUser ({commit}, {email, password, nick, city, ava}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        let user = await firebase.auth().createUserWithEmailAndPassword(email, password)
        user = user.user
        commit('setUser', new User(user.uid))

        const newUser = new Users(
          user.uid,
          email,
          nick,
          city,
          ava
        )
        await firebase.database().ref('users/' + user.uid).set(newUser)
        commit('createUser', {
          ...newUser
        })

        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async fetchUser ({commit}) {
      commit('clearError')
      commit('setLoading', true)
      const resultUser = []
      try {
        const userVal = await firebase.database().ref('users').once('value')
        const users = userVal.val()
        Object.keys(users).forEach(key => {
          const user = users[key]
          resultUser.push(
            new Users(
              user.id,
              user.email,
              user.nick,
              user.city,
              user.ava,
              key
            )
          )
          commit('loadUser', resultUser)
          commit('setLoading', false)
        })
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
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
    users (state) {
      return state.users
    },
    isUserLogin (state) {
      return state.user !== null
    },
    userById (state) {
      return userId => {
        return state.users.find(user => user.id === userId)
      }
    }
  }
}
