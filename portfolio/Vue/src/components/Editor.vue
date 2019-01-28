<template>
  <v-flex xs12>
    <v-flex xs12>
      <v-btn-toggle v-for="(tag, i) in tags" :key="i">
        <v-tooltip bottom>
          <v-btn @click="addTag(`[${tag.tag}]`, `[/${tag.tag}]`)" flat slot="activator">
            <span v-if="tag.text">{{ tag.text }}</span>
            <v-icon>{{ tag.icon }}</v-icon>
          </v-btn>
          <span>{{ tag.tooltip }}</span>
        </v-tooltip>
      </v-btn-toggle>
    </v-flex>
    <v-flex xs12>
      <v-textarea
        :id="typeEditor+'Text'"
        class="text_input"
        name="description"
        label="Description"
        type="text"
        v-model="description"
        required
        @input="updateDescription(description)"
        :rules="[v => !!v || 'поле обязательно для заполнения']"
      ></v-textarea>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          flat
          color="green"
          @click="show = !show"
        >
          {{ show ? 'Скрыть превью' : 'Показать превью' }}
        </v-btn>
      </v-card-actions>
      <div class="content mb-4" v-if="show" v-html="preview"></div>
    </v-flex>
  </v-flex>
</template>

<script>
  export default {
    props: ['typeEditor'],
    data () {
      return {
        show: false,
        description: '',
        tags: [
          {tag: 'b', icon: 'format_bold', tooltip: 'жирный текст'},
          {tag: 'i', icon: 'format_italic', tooltip: 'курсив'},
          {tag: 'u', icon: 'format_underlined', tooltip: 'подчеркнутый текст'},
          {tag: 's', icon: 'format_clear', tooltip: 'зачеркнутый текст'},
          {tag: 'sub', icon: 'vertical_align_bottom', tooltip: 'нижний индекс'},
          {tag: 'sup', icon: 'vertical_align_top', tooltip: 'верхний индекс'},
          {tag: 'h1', icon: 'title', tooltip: 'заголовок'},
          {tag: 'h2', icon: 'text_fields', tooltip: 'подзаголовок'},
          {tag: 'p', icon: 'format_align_justify', tooltip: 'абзац'},
          {tag: 'quote', icon: 'format_quote', tooltip: 'цитата'},
          {tag: 'notes', icon: 'notes', tooltip: 'заметка'},
          {tag: 'ol', icon: 'format_list_numbered', tooltip: 'нумерованный список'},
          {tag: 'ul', icon: 'format_list_bulleted', tooltip: 'ненумерованный список'},
          {tag: 'li', icon: 'format_list_numbered_rtl', tooltip: 'элемент списка'},
          {tag: 'img', icon: 'insert_photo', tooltip: 'ссылка на картинку'},
          {tag: 'a', icon: 'attach_file', tooltip: 'ссылка'},
          {tag: 'a#', icon: 'insert_link', tooltip: 'якорная ссылка'},
          {tag: '-a', icon: 'wrap_text', tooltip: 'ссылка на якорную ссылку'},
          {tag: 'fiddle', icon: 'code', tooltip: 'ссылка на fiddle JS', text: 'JS'},
          {tag: 'fiddlehtml', icon: 'code', tooltip: 'ссылка на fiddle HTML', text: 'HTML'},
          {tag: 'fiddlecss', icon: 'code', tooltip: 'ссылка на fiddle CSS', text: 'CSS'}
        ]
      }
    },
    computed: {
      preview () {
        console.log(this.mylib.bbCodeToTag(this.description))
        return this.mylib.bbCodeToTag(this.description)
      }
    },
    methods: {
      updateDescription: function (value) {
        this.description = value
        this.$emit('input', value)
      },
      editTagDescription: function (value) {
        let des = this.mylib.bbCodeToTag(value)
        this.updateDescription(des)
      },
      addTag (tag1, tag2) {
        const id = '#' + this.typeEditor + 'Text'
        const el = document.querySelector(id)
        if (typeof el.selectionStart === 'number') {
          const tag = '<' + tag1 + '></' + tag2 + '>'.length
          const value = el.value || ''
          const start = el.selectionStart
          const end = el.selectionEnd
          const len = end - start
          el.value = value.substring(0, start) + tag1 + value.substring(start, end) + tag2 + value.substring(end)
          el.setSelectionRange(start + len + tag, start + len + tag)
          this.description = el.value
        }
        this.updateDescription(this.description)
      }
    }
  }
</script>
<style scoped>
  >>> .v-card__actions{
    padding: 0;
  }
  .content >>> img, .text_input  >>> img{
    width: 100%;
  } 
  >>>.text_input textarea{
    white-space: pre-wrap;
    line-height: 1.7;
    font-family:  medium-content-serif-font,Georgia,Cambria,"Times New Roman",Times,serif;
    font-weight: 400;
    font-size: 18px;
    font-style: normal;
    letter-spacing: -.003em;
    color: #333;
  }
  >>>.S{color:red}/* Строки красные */
  >>>.gly{color:green}/* Строки красные */
  >>>.func{color:blue}/* Юзер-функции синие */
  >>>.C{color:orange}/* Комменты оранжевые */
  >>>.kwrd{color:pink}/* Ключевые слова полужирные */
  >>>.methods{color:brown}/* Ключевые слова полужирные */
  >>>.arg{color:orange}/* Ключевые слова полужирные */
  >>>.this{color:purple}/* Ключевые слова полужирные */
  >>>.R{color:gray} /*Серые регвыражения */
</style>
<!-- <script async src="//jsfiddle.net/xnjc03hy/103/embed/js,html,css,result/dark/"></script>
<iframe width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/534234636&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe> -->
