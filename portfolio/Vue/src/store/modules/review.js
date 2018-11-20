import * as firebase from 'firebase'

class Review {
  constructor (reviewGraphic, reviewGameplay, reviewSound, reviewDialog, reviewOriginal, reviewGame, productId, done = false, id = null) {
    this.reviewGraphic = reviewGraphic
    this.reviewGameplay = reviewGameplay
    this.reviewSound = reviewSound
    this.reviewDialog = reviewDialog
    this.reviewOriginal = reviewOriginal
    this.reviewGame = reviewGame
    this.productId = productId
    this.done = done
    this.id = id
  }
}

export default {
  state: {
    reviews: []
  },
  mutations: {
    loadReview (state, payload) {
      state.reviews = payload
    }
  },
  actions: {
    async addReview ({commit}, {reviewGraphic, reviewGameplay, reviewSound, reviewDialog, reviewOriginal, reviewGame, productId, ownerId}) {
      const review = new Review(reviewGraphic, reviewGameplay, reviewSound, reviewDialog, reviewOriginal, reviewGame, productId)
      commit('clearError')
      try {
        await firebase.database().ref(`/users/${ownerId}/reviews`).push(review)
      } catch (error) {
        commit('setError', error.message)
        throw error
      }
    },
    async fetchReview ({commit, getters}) {
      commit('setLoading', true)
      commit('clearError')
      const resultReview = []
      try {
        const fbVal = await firebase.database().ref(`/users/${getters.user.id}/reviews`).once('value')
        const reviews = fbVal.val()
        Object.keys(reviews).forEach(key => {
          const review = reviews[key]
          resultReview.push(new Review(
            review.reviewGraphic,
            review.reviewGameplay,
            review.reviewSound,
            review.reviewDialog,
            review.reviewOriginal,
            review.reviewGame,
            review.productId,
            review.done,
            key))
        })
        commit('loadReview', resultReview)
        commit('setLoading', false)
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
      }
    },
    async markOrderDone ({commit, getters}, payload) {
      commit('clearError')
      try {
        await firebase.database().ref(`/users/${getters.user.id}/reviews`).child(payload).update({
          done: true
        })
      } catch (error) {
        commit('setError', error.message)
        throw error
      }
    }
  },
  getters: {
    doneReview (state) {
      return state.reviews.filter(review => review.done)
    },
    undoneReview (state) {
      return state.reviews.filter(review => !review.done)
    },
    reviews (state, getters) {
      return getters.undoneReview.concat(getters.doneReview)
    }
  }
}
