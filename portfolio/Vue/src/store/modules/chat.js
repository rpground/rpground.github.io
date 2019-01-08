import * as firebase from 'firebase'

class Comment {
  constructor (parentId, text, bookmarks = null, date, isDelete = false, likes = [], ownerId, id = null) {
    this.parentId = parentId
    this.text = text
    this.bookmarks = bookmarks
    this.date = date
    this.isDelete = isDelete
    this.likes = likes
    this.ownerId = ownerId
    this.id = id
  }
}

export default {
  state: {
    comments: []
  },
  mutations: {
    loadComment (state, payload) {
      state.comments = payload
    },
    createComment (state, payload) {
      state.comments[payload.parentId][payload.key] = payload
    },
    deleteComment (state, {parentId, isDelete, id}) {
      const comment = state.comments[parentId].find(a => a.id === id)
      comment.isDelete = isDelete
    },
    addLikeComment (state, {parentId, likes, id, userId}) {
      state.comments[parentId].find(a => {
        return a.id === id
      })
    }
  },
  actions: {
    async fetchComment ({commit}) {
      commit('clearError')
      const resultComment = []
      try {
        const commentVal = await firebase.database().ref(`comments`).once('value')
        const comments = commentVal.val()
        if (comments === null) return
        Object.keys(comments).forEach(key => {
          const comment = comments[key]
          const resultPost = []
          Object.keys(comment).forEach(keys => {
            const post = comment[keys]
            resultPost.push(
              new Comment(
                post.parentId,
                post.text,
                post.bookmarks,
                post.date,
                post.isDelete,
                post.likes,
                post.ownerId,
                keys
              )
            )
          })
          resultComment[key] = resultPost
        })
        commit('loadComment', resultComment)
      } catch (error) {
        commit('setError', error.message)
        throw error
      }
    },
    async createComment ({commit, getters}, {parentId, text, bookmarks, date}) {
      commit('clearError')
      // commit('setLoading', true)
      const ownerId = await getters.user.id
      try {
        const newComment = new Comment(parentId, text, bookmarks, date, false, [], ownerId || null)
        const comment = await firebase.database().ref(`comments/${parentId}`).push(newComment)
        commit('createComment', {
          ...newComment,
          id: comment.key
        })
      } catch (error) {
        commit('setError', error.message)
        throw error
      }
    },
    async deleteComment ({commit}, {parentId, isDelete, id}) {
      commit('clearError')
      try {
        isDelete = !isDelete
        await firebase.database().ref(`comments/${parentId}`).child(id).update({isDelete})
        commit('deleteComment', {parentId, isDelete, id})
      } catch (error) {
        commit('setError', error.message)
        throw error
      }
    },
    async addLikeComment ({commit, getters}, {parentId, likes, id}) {
      commit('clearError')
      const userId = await getters.user.id
      if (likes.includes(userId)) {
        likes.splice(likes.indexOf(userId), 1)
      } else {
        likes.push(userId)
      }
      try {
        await firebase.database().ref(`comments/${parentId}`).child(id).update({likes})
        commit('addLikeComment', {parentId, likes, id, userId})
      } catch (error) {
        commit('setError', error.message)
        throw error
      }
    }
  },
  getters: {
    comments (state) {
      return state.comments
    },
    commentsLength (state) {
      return commentId => {
        return state.comments[commentId].length
      }
    },
    commentById (state) {
      return commentId => {
        return state.comments ? state.comments[commentId] : null
      }
    }
  }
}
