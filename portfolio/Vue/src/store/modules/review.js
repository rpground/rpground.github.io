import * as firebase from 'firebase'

class Review {
  constructor (reviewGraphic, reviewGameplay, reviewSound, reviewDialog, reviewOriginal, reviewGame, ownerId, done = false, id = null) {
    this.reviewGraphic = reviewGraphic
    this.reviewGameplay = reviewGameplay
    this.reviewSound = reviewSound
    this.reviewDialog = reviewDialog
    this.reviewOriginal = reviewOriginal
    this.reviewGame = reviewGame
    this.ownerId = ownerId
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
    },
    addReview (state, payload) {
      state.comments[payload.productId][payload.id] = payload
    }
  },
  actions: {
    async addReview ({commit, getters}, {reviewGraphic, reviewGameplay, reviewSound, reviewDialog, reviewOriginal, reviewGame, productId}) {
      commit('clearError')
      const ownerId = await getters.user.id
      const newReview = new Review(reviewGraphic, reviewGameplay, reviewSound, reviewDialog, reviewOriginal, reviewGame, ownerId || null)
      try {
        await firebase.database().ref(`reviews/${productId}/${ownerId}`).set(newReview)
        commit('addReview', {
          ...newReview,
          id: ownerId
        })
      } catch (error) {
        commit('setError', error.message)
        throw error
      }
    },
    async fetchReview ({commit}) {
      commit('clearError')
      const resultReview = []
      try {
        const reviewVal = await firebase.database().ref(`reviews`).once('value')
        const reviews = reviewVal.val()
        if (reviews === null) return
        Object.keys(reviews).forEach(key => {
          const review = reviews[key]
          Object.keys(review).forEach(keys => {
            review[keys] = new Review(
              review[keys].reviewGraphic,
              review[keys].reviewGameplay,
              review[keys].reviewSound,
              review[keys].reviewDialog,
              review[keys].reviewOriginal,
              review[keys].reviewGame,
              review[keys].ownerId,
              review[keys].done,
              review[keys].id,
              keys
            )
          })
          resultReview[key] = review
        })
        commit('loadReview', resultReview)
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
    },
    reviewById (state) {
      return reviewId => {
        return state.reviews ? state.reviews[reviewId] : null
      }
    }
  }
}
