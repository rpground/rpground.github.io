<template>
  <v-layout wrap row class="mt-4">
    <v-flex xs12>
      <v-hover>
        <v-card
          slot-scope="{ hover }"
          :class="`elevation-${hover ? 12 : 2}`"
          class="mb-4"
          id="editor"
        >    
          <v-card-title primary-title>
            <app-user :id="isUser"></app-user>
          </v-card-title>

          <v-card-actions>
            <v-btn
              @click="show = true"
              flat
              color="green"
              @click.native="addComment"
            >
              {{ show ? 'Отправить' : ' Написать комментарий' }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon @click="show = !show">
              <v-icon>
                {{ show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}
              </v-icon>
            </v-btn>
          </v-card-actions>

          <v-slide-y-transition>
            <v-card-text v-show="show">
              <v-form ref="form" lazy-validation>
                <app-editor
                  ref="Editor"
                  v-model="newComment"
                  typeEditor="comment"
                ></app-editor>
              </v-form>
            </v-card-text>
          </v-slide-y-transition>
        </v-card>
      </v-hover>
    </v-flex>

    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title> {{ tittleDialog }}</v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click="dialog = false">
            Отмена
          </v-btn>
          <v-btn color="green darken-1" flat="flat" @click.native="deleteComment()">
            {{ btnDialog }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <template v-if="!loading && comments">
      <v-flex
        v-for="(comment, i) in comments"
        :key="i"
        xs12
      >    
        <v-hover>
          <v-card
            slot-scope="{ hover }"
            :class="`elevation-${hover ? 12 : 2}`"
            class="mb-4"
          >
            <v-card-title primary-title>
              <app-user :id="comment.ownerId"></app-user>
            </v-card-title>

            <v-card-text class="content" :class="{'red--text': comment.isDelete}" v-html="comment.isDelete ? 'комментарий удален' : comment.text">
            </v-card-text>

            <v-divider light></v-divider>

            <v-card-actions>
              <div class="date">{{ comment.date }}</div>

              <v-spacer></v-spacer>
              <span class="green--text text--lighten-1 caption">{{ comment.likes.length }}</span>  
              <v-btn :class="{'green--text': comment.likes.includes(isUser)}" icon @click.native="addLike(i)">
                <v-icon>favorite</v-icon>
              </v-btn>

              <v-btn v-if="isUser===comment.ownerId" icon @click.native="addIdComment(i)">
                <v-icon v-if="!comment.isDelete">delete</v-icon>
                <v-icon v-else>delete_forever</v-icon>
              </v-btn>

              <v-btn icon @click.native="addBookmark(i)">
                <v-icon>bookmark</v-icon>
              </v-btn>
              <v-btn icon @click.native="addQuote(i, $event)">
                <v-icon>format_quote</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-flex>
    </template>
    <v-layout v-else-if="!loading && !comments">
      <v-flex xs12 class="text-xs-center">
        <h1 class="text--primary">You have no comments</h1>
      </v-flex>
    </v-layout>
    <v-layout v-else>
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular
          :size="50"
          :width="4"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </v-flex>
    </v-layout> 
  </v-layout>
</template>

<script>
import Editor from './Editor'
import User from './User'
export default {
  props: ['state'],
  data () {
    return {
      show: false,
      newComment: '',
      notes: '',
      idComment: '',
      tittleDialog: '',
      btnDialog: '',
      localLoading: false,
      dialog: ''
    }
  },
  computed: {
    parent () {
      return this.state.constructor.name
    },
    comments () {
      return this.$store.getters.commentById(this.state.id)
    },
    loading () {
      return this.$store.getters.loading
    },
    isUser () {
      return this.$store.getters.user.id
    },
    users () {
      return this.$store.getters.users
    }
  },
  methods: {
    addComment () {
      if (this.newComment !== '') {
        this.localLoading = true

        this.$refs.Editor.editTagDescription(this.newComment)
        console.log(this.newComment)
        this.$store.dispatch(`createComment`, {
          parentId: this.state.id,
          text: this.newComment,
          bookmarks: 0,
          date: new Date().toISOString().slice(0, 19).replace(/T/g, ' ').replace(/-/g, '.')
        })
        this.$store.dispatch('fetchComment')
        this.$refs.Editor.updateDescription('')
        this.show = false
        this.localLoading = false
      }
    },
    addLike (i) {
      this.localLoading = true
      this.$store.dispatch('addLikeComment', {
        likes: this.comments[i].likes,
        parentId: this.comments[i].parentId,
        id: this.comments[i].id
      })
      this.localLoading = false
    },
    addBookmark (i) {
      console.log(this.mylib.hello('w'))
    },
    addIdComment (i) {
      this.idComment = i
      this.tittleDialog = (this.comments[i].isDelete) ? 'Восстановить комментарий?' : 'Удалить комментарий?'
      this.btnDialog = (this.comments[i].isDelete) ? 'Восстановить' : 'Удалить'
      this.dialog = true
    },
    addQuote (i) {
      const comment = this.comments[i]
      // приведение кода HTML комментария к тегам
      const text = comment.text
      let des = this.mylib.tagToBbCode(text)
      const user = this.users.find(user => user.id === comment.ownerId)
      const notes = `${this.newComment}[p]${user.nick} пишет:[/p][quote]${des}[/quote]`
      this.$refs.Editor.updateDescription(notes)
      this.show = true
      // скроллинг к комментарию
      let theElement = document.getElementById('editor')
      let selectedPosX = 0
      let selectedPosY = 0
      while (theElement != null) {
        selectedPosX += theElement.offsetLeft
        selectedPosY += theElement.offsetTop
        theElement = theElement.offsetParent
      }
      window.scrollTo(selectedPosX, selectedPosY)
    },
    deleteComment () {
      this.localLoading = true
      const id = this.idComment
      this.$store.dispatch('deleteComment', {
        parentId: this.comments[id].parentId,
        isDelete: this.comments[id].isDelete,
        id: this.comments[id].id
      })
      this.dialog = ''
      this.localLoading = false
    }
  },
  components: {
    appUser: User,
    appEditor: Editor
  }
}
</script>

<style scoped>
  >>> blockquote {
    margin: 0 0;
    padding: 1em;
    background-color: #eee;
  }
  >>> p{
    margin-bottom: 0;
  }
  >>>  .notes{
    border-left: 6px solid #00c8aa;
    padding-left: 1em;
    margin: 0 1em;
    margin-left: 0;
    font-style: italic;
  }
  .v-card__text {
    font-family:  medium-content-serif-font,Georgia,Cambria,"Times New Roman",Times,serif;
    font-weight: 400;
    font-size: 18px;
    font-style: normal;
    letter-spacing: -.003em;
    color: #333;
    padding: 0 18px 10px;
    overflow-x: hidden;
  }
  .v-card__text >>> img{
    width: 100%;
  }
  #textarea {
    position:absolute;
  }
  .date {
    opacity: .54;
    font-size: 16px;
  }
  .date {
    font-size: 12px;
    margin-top: 12px;
  }
</style>