import * as firebase from 'firebase'

class Product {
  constructor (title, author, engine, genre, setting, feature, description, date, dateEnd, dateUpd, graphic, graphicstyle, music, script, story, trophy, site, download, prepared, promo, ownerId, id = null, imageSrc = '', rating = 0) {
    this.title = title
    this.author = author
    this.engine = engine
    this.genre = genre
    this.setting = setting
    this.feature = feature
    this.description = description
    this.date = date
    this.dateEnd = dateEnd
    this.dateUpd = dateUpd
    this.graphic = graphic
    this.graphicstyle = graphicstyle
    this.music = music
    this.script = script
    this.story = story
    this.trophy = trophy
    this.site = site
    this.download = download
    this.prepared = prepared
    this.promo = promo
    this.ownerId = ownerId
    this.id = id
    this.imageSrc = imageSrc
    this.rating = rating
  }
}

export default {
  state: {
    products: []
  },
  mutations: {
    createProduct (state, payload) {
      state.products.push(payload)
    },
    loadProducts (state, payload) {
      state.products = payload
    },
    updateProduct (state, {title, description, id}) {
      const product = state.products.find(a => {
        return a.id === id
      })
      product.title = title
      product.description = description
    },
    updateRatingProduct (state, {rating, id}) {
      const product = state.products.find(a => {
        return a.id === id
      })
      product.rating = rating
    }
  },
  actions: {
    async createProduct ({commit, getters}, payload) {
      commit('clearError')
      commit('setLoading', true)
      let images = payload.image
      const ownerId = await getters.user.id
      try {
        const newProduct = new Product(
          payload.title,
          payload.author,
          payload.engine,
          payload.genre,
          payload.setting,
          payload.feature,
          payload.description,
          payload.date,
          payload.dateEnd,
          payload.dateUpd,
          payload.graphic,
          payload.graphicstyle,
          payload.music,
          payload.script,
          payload.story,
          payload.trophy,
          payload.site,
          payload.download,
          payload.prepared,
          payload.promo,
          ownerId || null
        )
        const product = await firebase.database().ref('products').push(newProduct)
        const imageSrc = []

        for (const i in await Promise.all(images)) {
          const image = images[i]
          const fileData = await firebase.storage().ref(`products/${product.key}${image.name}`).put(image)
          imageSrc[i] = await firebase.storage().ref().child(fileData.ref.fullPath).getDownloadURL()
        }
        console.log(imageSrc)
        await firebase.database().ref('products').child(product.key).update({ imageSrc })
        commit('setLoading', false)
        commit('createProduct', {
          ...newProduct,
          id: product.key,
          imageSrc
        })
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
    async updateProduct ({commit}, {title, description, id}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        await firebase.database().ref('products').child(id).update({
          title,
          description
        })
        commit('updateProduct', {
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
    async updateRatingProduct ({commit, getters}, {value, rating, id}) {
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
        await firebase.database().ref('products').child(id).update({ rating })
        commit('updateRatingProduct', {rating, id})
      } catch (error) {
        commit('setError', error.message)
        throw error
      }
    },
    async fetchProduct ({commit}) {
      commit('clearError')
      commit('setLoading', true)
      const resultProducts = []
      try {
        const productsVal = await firebase.database().ref('products').once('value')
        const products = productsVal.val()
        Object.keys(products).forEach(key => {
          const product = products[key]
          resultProducts.push(
            new Product(
              product.title,
              product.author,
              product.engine,
              product.genre,
              product.setting,
              product.feature,
              product.description,
              product.date,
              product.dateEnd,
              product.dateUpd,
              product.graphic,
              product.graphicstyle,
              product.music,
              product.script,
              product.story,
              product.trophy,
              product.site,
              product.download,
              product.prepared,
              product.promo,
              product.ownerId,
              key,
              product.imageSrc,
              product.rating
            )
          )
          commit('loadProducts', resultProducts)
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
    products (state) {
      return state.products
    },
    promoProducts (state) {
      return state.products.filter(product => {
        return product.promo
      })
    },
    myProducts (state, getters) {
      if (!getters.user) return
      return state.products.filter(product => {
        return product.ownerId === getters.user.id
      })
    },
    productById (state) {
      return productId => {
        return state.products.find(product => product.id === productId)
      }
    }
  }
}
