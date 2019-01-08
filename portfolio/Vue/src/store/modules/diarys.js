import * as firebase from 'firebase'

class Diary {
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
    diarys: []
  },
  mutations: {
    createDiary (state, payload) {
      state.diarys.push(payload)
    },
    loadDiary (state, payload) {
      state.diarys = payload
    },
    updateDiary (state, {title, description, id}) {
      const diary = state.diarys.find(a => {
        return a.id === id
      })
      diary.title = title
      diary.description = description
    },
    updateRatingDiary (state, {rating, id}) {
      const diary = state.diarys.find(a => {
        return a.id === id
      })
      diary.rating = rating
    }
  },
  actions: {
    async createDiary ({commit, getters}, payload) {
      commit('clearError')
      commit('setLoading', true)
      let images = payload.image
      const ownerId = await getters.user.id
      try {
        const newDiary = new Diary(
          payload.title,
          payload.description,
          '',
          ownerId || null,
          0,
          payload.promo,
          payload.dateUpd
        )
        const diary = await firebase.database().ref('diarys').push(newDiary)
        const imageSrc = []
        // ok
        for (const i in await Promise.all(images)) {
          const image = images[i]
          const fileData = await firebase.storage().ref(`diarys/${diary.key}${image.name}`).put(image)
          imageSrc[i] = await firebase.storage().ref().child(fileData.ref.fullPath).getDownloadURL()
        }
        await firebase.database().ref('diarys').child(diary.key).update({ imageSrc })
        commit('setLoading', false)
        commit('createDiary', {
          ...newDiary,
          id: diary.key,
          rating: 0,
          imageSrc
        })
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
    async updateDiary ({commit}, {title, description, id}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        await firebase.database().ref('diarys').child(id).update({
          title,
          description
        })
        commit('updateDiary', {
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
    async updateRatingDiary ({commit, getters}, {value, rating, id}) {
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
        await firebase.database().ref('diarys').child(id).update({ rating })
        commit('updateRatingDiary', {rating, id})
      } catch (error) {
        commit('setError', error.message)
        throw error
      }
    },
    async fetchDiary ({commit}) {
      commit('clearError')
      commit('setLoading', true)
      const resultDiary = []
      try {
        const diaryVal = await firebase.database().ref('diarys').once('value')
        const diarys = diaryVal.val()
        Object.keys(diarys).forEach(key => {
          const diary = diarys[key]
          resultDiary.push(
            new Diary(
              diary.title,
              diary.description,
              diary.imageSrc,
              diary.ownerId,
              diary.rating,
              diary.promo,
              diary.dateUpd,
              diary.comment,
              key
            )
          )
          commit('loadDiary', resultDiary)
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
    diarys (state) {
      return state.diarys
    },
    promoDiary (state) {
      return state.diarys.filter(diary => {
        return diary.promo
      })
    },
    myDiary (state, getters) {
      if (!getters.user) return
      return state.diarys.filter(diary => {
        return diary.ownerId === getters.user.id
      })
    },
    diaryById (state) {
      return diaryId => {
        return state.diarys.find(diary => diary.id === diaryId)
      }
    }
  }
}
