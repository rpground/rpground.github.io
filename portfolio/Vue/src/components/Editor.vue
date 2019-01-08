<template>
  <v-flex xs12>
    <v-flex xs12>
      <v-btn-toggle multiple>
        <v-tooltip bottom>
          <v-btn @click="addTag('[b]', '[/b]')" flat slot="activator">
            <v-icon>format_bold</v-icon>
          </v-btn>
          <span>жирный текст</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-btn @click="addTag('[i]', '[/i]')" flat slot="activator">
            <v-icon>format_italic</v-icon>
          </v-btn>
          <span>курсив</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-btn @click="addTag('[u]', '[/u]')" flat slot="activator">
            <v-icon>format_underlined</v-icon>
          </v-btn>
          <span>подчеркнутый текст</span>
        </v-tooltip>
        <v-tooltip bottom>        
          <v-btn @click="addTag('[s]', '[/s]')" flat slot="activator">
            <v-icon>format_clear</v-icon>
          </v-btn>
          <span>зачеркнутый текст</span>
        </v-tooltip>
        <v-tooltip bottom>        
          <v-btn @click="addTag('[sub]', '[/sub]')" flat slot="activator">
            <v-icon>vertical_align_bottom</v-icon>
          </v-btn>
          <span>нижний индекс</span>
        </v-tooltip>
        <v-tooltip bottom>        
          <v-btn @click="addTag('[sup]', '[/sup]')" flat slot="activator">
            <v-icon>vertical_align_top</v-icon>
          </v-btn>
          <span>верхний индекс</span>
        </v-tooltip>
      </v-btn-toggle>

      <v-btn-toggle>
        <v-tooltip bottom>
          <v-btn @click="addTag('[h1]', '[/h1]')" flat slot="activator">
            <v-icon>title</v-icon>
          </v-btn>
          <span>заголовок</span>
        </v-tooltip>
        <v-tooltip bottom>        
          <v-btn @click="addTag('[h2]', '[/h2]')" flat slot="activator">
            <v-icon>text_fields</v-icon>
          </v-btn>
          <span>подзаголовок</span>
        </v-tooltip>
        <v-tooltip bottom>        
          <v-btn @click="addTag('[p]', '[/p]')" flat slot="activator">
            <v-icon>format_align_justify</v-icon>
          </v-btn>
          <span>абзац</span>
        </v-tooltip>
        <v-tooltip bottom>        
          <v-btn @click="addTag('[quote]', '[/quote]')" flat slot="activator">
            <v-icon>format_quote</v-icon>
          </v-btn>
          <span>цитата</span>
        </v-tooltip>
        <v-tooltip bottom>        
          <v-btn @click="addTag('[notes]', '[/notes]')" flat slot="activator">
            <v-icon>notes</v-icon>
          </v-btn>
          <span>заметка</span>
        </v-tooltip>
      </v-btn-toggle>

      <v-btn-toggle>
        <v-tooltip bottom>
          <v-btn @click="addTag('[ol]', '[/ol]')" flat slot="activator">
            <v-icon>format_list_numbered</v-icon>
          </v-btn>
          <span>нумерованный список</span>
        </v-tooltip>
        <v-tooltip bottom>        
          <v-btn @click="addTag('[ul]', '[/ul]')" flat slot="activator">
            <v-icon>format_list_bulleted</v-icon>
          </v-btn>
          <span>ненумерованный список</span>
        </v-tooltip>
        <v-tooltip bottom>        
          <v-btn @click="addTag('[li]', '[/li]')" flat slot="activator">
            <v-icon>format_list_numbered_rtl</v-icon>
          </v-btn>
          <span>элемент списка</span>
        </v-tooltip>

      </v-btn-toggle>

      <v-btn-toggle>
        <v-tooltip bottom>
          <v-btn  @click="addTag('[img]', '[/img]')" flat slot="activator">
            <v-icon>insert_photo</v-icon>
          </v-btn>
        <span>ссылка на картинку</span>
        </v-tooltip>
        <v-tooltip bottom>        
          <v-btn @click="addTag('[a]', '[/a]')" flat slot="activator">
            <v-icon>attach_file</v-icon>
          </v-btn>
          <span>ссылка</span>
        </v-tooltip>
        <v-tooltip bottom>        
          <v-btn @click="addTag('[a#]', '[/a#]')" flat slot="activator">
            <v-icon>insert_link</v-icon>
          </v-btn>
          <span>якорная ссылка</span>
        </v-tooltip>
        <v-tooltip bottom>        
          <v-btn @click="addTag('[-a]', '[/-a]')" flat slot="activator">
            <v-icon>wrap_text</v-icon>
          </v-btn>
          <span>ссылка на якорную ссылку</span>
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
        description: ''
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
  >>> .text_input {
    white-space: pre-wrap;
    line-height: 1.7;
    font-family:  medium-content-serif-font,Georgia,Cambria,"Times New Roman",Times,serif;
    font-weight: 400;
    font-size: 18px;
    font-style: normal;
    letter-spacing: -.003em;
    color: #333;
  }
  
</style>
<!-- <script async src="//jsfiddle.net/xnjc03hy/103/embed/js,html,css,result/dark/"></script>
<iframe width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/534234636&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe> -->
