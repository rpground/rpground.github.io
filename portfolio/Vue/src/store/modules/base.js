import * as firebase from 'firebase'

export default {
  state: {
    base: []
  },
  mutations: {
    loadBase (state, payload) {
      state.base = payload
    },
    updateBase (state, {el, payload}) {
      state.base[el] = payload
    }
  },
  actions: {
    async updateBase ({commit}, {el, payload}) {
      commit('clearError')
      try {
        await firebase.database().ref(`base/${el}`).set(payload)
        commit('updateBase', {el, payload})
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
    async fetchBase ({commit}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const base = await firebase.database().ref('base').once('value')
        const resultBase = base.val()
        commit('loadBase', resultBase)
        commit('setLoading', false)
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    }
  },
  getters: {
    base (state) {
      return state.base
    }
  }
}
