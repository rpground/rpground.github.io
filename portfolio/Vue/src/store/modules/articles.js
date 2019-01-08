import * as firebase from 'firebase'

class Article {
  constructor (title, description, imageSrc = '', ownerId, rating, promo = false, dateUpd = null, comment = [], id = null) {
    this.title = title
    this.description = description
    this.promo = promo
    this.imageSrc = imageSrc
    this.ownerId = ownerId
    this.rating = rating
    this.dateUpd = dateUpd
    this.comment = comment
    this.id = id
  }
}

export default {
  state: {
    articles: []
  },
  mutations: {
    createArticle (state, payload) {
      state.articles.push(payload)
    },
    loadArticle (state, payload) {
      state.articles = payload
    },
    updateArticle (state, {title, description, id}) {
      const article = state.articles.find(a => {
        return a.id === id
      })
      article.title = title
      article.description = description
    },
    updateRatingArticle (state, {rating, id}) {
      const article = state.articles.find(a => {
        return a.id === id
      })
      article.rating = rating
    }
  },
  actions: {
    async createArticle ({commit, getters}, payload) {
      commit('clearError')
      commit('setLoading', true)
      let images = payload.image
      const ownerId = await getters.user.id
      try {
        const newArticle = new Article(
          payload.title,
          payload.description,
          '',
          ownerId || null,
          0,
          payload.promo,
          payload.dateUpd
        )
        const article = await firebase.database().ref('articles').push(newArticle)
        const imageSrc = []
        // ok
        for (const i in await Promise.all(images)) {
          const image = images[i]
          const fileData = await firebase.storage().ref(`articles/${article.key}${image.name}`).put(image)
          imageSrc[i] = await firebase.storage().ref().child(fileData.ref.fullPath).getDownloadURL()
        }
        await firebase.database().ref('articles').child(article.key).update({ imageSrc })
        commit('setLoading', false)
        commit('createArticle', {
          ...newArticle,
          id: article.key,
          rating: 0,
          imageSrc
        })
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
    async updateArticle ({commit}, {title, description, id}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        await firebase.database().ref('articles').child(id).update({
          title,
          description
        })
        commit('updateArticle', {
          title,
          description,
          id
        })
        commit('setLoading', false)
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
    async updateRatingArticle ({commit, getters}, {value, rating, id}) {
      commit('clearError')
      const user = await getters.user.id
      const ratingValues = rating.map(function (el) {
        return el.user
      })
      if (ratingValues.includes(user)) {
        rating[ratingValues.indexOf(user)].value = value
      } else {
        rating.push({value: value, user: user})
      }
      try {
        await firebase.database().ref('articles').child(id).update({ rating })
        commit('updateRatingArticle', {rating, id})
      } catch (error) {
        commit('setError', error.message)
        throw error
      }
    },
    async fetchArticle ({commit}) {
      commit('clearError')
      commit('setLoading', true)
      const resultArticle = []
      try {
        const articleVal = await firebase.database().ref('articles').once('value')
        const articles = articleVal.val()
        Object.keys(articles).forEach(key => {
          const article = articles[key]
          resultArticle.push(
            new Article(
              article.title,
              article.description,
              article.imageSrc,
              article.ownerId,
              article.rating,
              article.promo,
              article.dateUpd,
              article.comment,
              key
            )
          )
          commit('loadArticle', resultArticle)
          commit('setLoading', false)
        })
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    }
  },
  getters: {
    articles (state) {
      return state.articles
    },
    promoArticle (state) {
      return state.articles.filter(article => {
        return article.promo
      })
    },
    myArticle (state, getters) {
      if (!getters.user) return
      return state.articles.filter(article => {
        return article.ownerId === getters.user.id
      })
    },
    articleById (state) {
      return articleId => {
        return state.articles.find(article => article.id === articleId)
      }
    }
  }
}
