import * as firebase from 'firebase'

class Code {
  constructor (title, script, version, typescript, engine, description, imageSrc = '', ownerId, rating, promo = false, dateUpd = null, comment = [], id = null) {
    this.title = title
    this.script = script
    this.version = version
    this.typescript = typescript
    this.engine = engine
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
    codes: []
  },
  mutations: {
    createCode (state, payload) {
      state.codes.push(payload)
    },
    loadCode (state, payload) {
      state.codes = payload
    },
    updateCode (state, {title, script, version, typescript, engine, description, id}) {
      const code = state.codes.find(a => {
        return a.id === id
      })
      code.title = title
      code.script = script
      code.version = version
      code.typescript = typescript
      code.engine = engine
      code.description = description
    },
    updateRatingCode (state, {rating, id}) {
      const code = state.codes.find(a => {
        return a.id === id
      })
      code.rating = rating
    }
  },
  actions: {
    async createCode ({commit, getters}, payload) {
      commit('clearError')
      commit('setLoading', true)
      let images = payload.image
      const ownerId = await getters.user.id
      try {
        const newCode = new Code(
          payload.title,
          payload.script,
          payload.version,
          payload.typescript,
          payload.engine,
          payload.description,
          '',
          ownerId || null,
          0,
          payload.promo,
          payload.dateUpd
        )
        const code = await firebase.database().ref('codes').push(newCode)
        const imageSrc = []
        // ok
        for (const i in await Promise.all(images)) {
          const image = images[i]
          const fileData = await firebase.storage().ref(`codes/${code.key}${image.name}`).put(image)
          imageSrc[i] = await firebase.storage().ref().child(fileData.ref.fullPath).getDownloadURL()
        }
        await firebase.database().ref('codes').child(code.key).update({ imageSrc })
        commit('setLoading', false)
        commit('createCode', {
          ...newCode,
          id: code.key,
          rating: 0,
          imageSrc
        })
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
    async updateCode ({commit}, {title, script, version, typescript, engine, description, id}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        await firebase.database().ref('codes').child(id).update({
          title,
          description
        })
        commit('updateCode', {
          title,
          script,
          version,
          typescript,
          engine,
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
    async updateRatingCode ({commit, getters}, {value, rating, id}) {
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
        await firebase.database().ref('codes').child(id).update({ rating })
        commit('updateRatingCode', {rating, id})
      } catch (error) {
        commit('setError', error.message)
        throw error
      }
    },
    async fetchCode ({commit}) {
      commit('clearError')
      commit('setLoading', true)
      const resultCode = []
      try {
        const codeVal = await firebase.database().ref('codes').once('value')
        const codes = codeVal.val()
        Object.keys(codes).forEach(key => {
          const code = codes[key]
          resultCode.push(
            new Code(
              code.title,
              code.script,
              code.version,
              code.typescript,
              code.engine,
              code.description,
              code.imageSrc,
              code.ownerId,
              code.rating,
              code.promo,
              code.dateUpd,
              code.comment,
              key
            )
          )
          commit('loadCode', resultCode)
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
    codes (state) {
      return state.codes
    },
    promoCode (state) {
      return state.codes.filter(code => {
        return code.promo
      })
    },
    myCode (state, getters) {
      if (!getters.user) return
      return state.codes.filter(code => {
        return code.ownerId === getters.user.id
      })
    },
    codeById (state) {
      return codeId => {
        return state.codes.find(code => code.id === codeId)
      }
    }
  }
}
