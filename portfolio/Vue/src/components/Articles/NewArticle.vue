<template>
  <v-container>
    <v-layout row v-if="!loading">
      <v-flex xs12 sm8 offset-sm2>
        <h1 color="cyan">Create New Article</h1>            
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            name="title"
            label="Title"
            type="text"
            required
            v-model="title"
            :rules="[v => !!v || 'поле обязательно для заполнения']"
          ></v-text-field>
          <img src="">
          <v-flex xs12>
            <v-btn-toggle multiple>
              <v-btn @click="addTag('[b]', '[/b]')" flat>
                <v-icon>format_bold</v-icon>
              </v-btn>
              <v-btn @click="addTag('[i]', '[/i]')" flat>
                <v-icon>format_italic</v-icon>
              </v-btn>
              <v-btn @click="addTag('[u]', '[/u]')" flat>
                <v-icon>format_underlined</v-icon>
              </v-btn>
              <v-btn @click="addTag('[s]', '[/s]')" flat>
                <v-icon>format_clear</v-icon>
              </v-btn>
              <v-btn @click="addTag('[sub]', '[/sub]')" flat>
                <v-icon>vertical_align_bottom</v-icon>
              </v-btn>
              <v-btn @click="addTag('[sup]', '[/sup]')" flat>
                <v-icon>vertical_align_top</v-icon>
              </v-btn>
            </v-btn-toggle>

            <v-btn-toggle>
              <v-btn @click="addTag('[h1]', '[/h1]')" flat>
                <v-icon>title</v-icon>
              </v-btn>
              <v-btn @click="addTag('[h2]', '[/h2]')" flat>
                <v-icon>text_fields</v-icon>
              </v-btn>
              <v-btn @click="addTag('[p]', '[/p]')" flat>
                <v-icon>format_align_justify</v-icon>
              </v-btn>
              <v-btn @click="addTag('[blockquote]', '[/blockquote]')" flat>
                <v-icon>format_quote</v-icon>
              </v-btn>
              <v-btn @click="addTag('[notes]', '[/notes]')" flat>
                <v-icon>notes</v-icon>
              </v-btn>
            </v-btn-toggle>

            <v-btn-toggle>
              <v-btn @click="addTag('[ol]', '[/ol]')" flat>
                <v-icon>format_list_numbered</v-icon>
              </v-btn>
              <v-btn @click="addTag('[ul]', '[/ul]')" flat>
                <v-icon>format_list_bulleted</v-icon>
              </v-btn>
              <v-btn @click="addTag('[li]', '[/li]')" flat>
                <v-icon>format_list_numbered_rtl</v-icon>
              </v-btn>
            </v-btn-toggle>

            <v-btn-toggle>
              <v-btn  @click="addTag('[img]', '[/img]')" flat>
                <v-icon>insert_photo</v-icon>
              </v-btn>
              <v-btn @click="addTag('[a]', '[/a]')" flat>
                <v-icon>attach_file</v-icon>
              </v-btn>
              <v-btn @click="addTag('[a#]', '[/a#]')" flat>
                <v-icon>insert_link</v-icon>
              </v-btn>
              <v-btn @click="addTag('[-a]', '[/-a]')" flat>
                <v-icon>wrap_text</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-flex>

          <v-textarea
            id="text"
            name="description"
            label="Description"
            type="text"
            v-model="description"
            required
            :rules="[v => !!v || 'поле обязательно для заполнения']"
          ></v-textarea> 
        </v-form>
        <v-layout>
          <v-flex xs12>
            <img src="" width="100%">
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs12>
            <v-btn dark color="cyan" @click="upload">
              Upload
              <v-icon right dark>cloud_upload</v-icon>
            </v-btn>
            <input
              ref="fileInput" 
              type="file"
              multiple
              style="display: none;" 
              accept="image/*"
              @change="onFileChange"
            >            
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs12>
            <v-switch
              color="success"
              label="Add to Promo?"
              v-model="promo"
            ></v-switch>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs12>
            <v-spacer></v-spacer>
            <v-btn
              :loading="loading"
              :disabled="!valid || !image"
              class="success"
              @click="createArticle"
            >Create Article</v-btn>
          </v-flex>
        </v-layout>                
      </v-flex>
    </v-layout>

    <v-layout v-else>
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular
          :size="50"
          :width="4"
          color="cyan"
          indeterminate
        ></v-progress-circular>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        title: '',
        description: '',
        image: [],
        imageSrc: [],
        promo: false,
        valid: false,
        dateUpd: ''
      }
    },
    computed: {
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      addTag (tag1, tag2) {
        const txt = document.querySelector('#text')
        if (typeof txt.selectionStart === 'number') {
          const tag = '<' + tag1 + '></' + tag2 + '>'.length
          const value = txt.value
          const start = txt.selectionStart
          const end = txt.selectionEnd
          const len = end - start
          txt.value = value.substring(0, start) + tag1 + value.substring(start, end) + tag2 + value.substring(end)
          txt.setSelectionRange(start + len + tag, start + len + tag)
          this.description = txt.value
        }
      },
      createArticle () {
        if (this.$refs.form.validate() && this.image) {
          let des = this.description
          des = des.replace(/\[p\]/g, '<p>').replace(/\[\/p\]/g, '</p>')
          des = des.replace(/\[h1\]/g, '<h3>').replace(/\[\/h1\]/g, '</h3>')
          des = des.replace(/\[h2\]/g, '<h4>').replace(/\[\/h2\]/g, '</h4>')
          des = des.replace(/\[b\]/g, '<b>').replace(/\[\/b\]/g, '</b>')
          des = des.replace(/\[u\]/g, '<u>').replace(/\[\/u\]/g, '</u>')
          des = des.replace(/\[ul\]/g, '<ul>').replace(/\[\/ul\]/g, '</ul>')
          des = des.replace(/\[ol\]/g, '<ol>').replace(/\[\/ol\]/g, '</ol>')
          des = des.replace(/\[li\]/g, '<li>').replace(/\[\/li\]/g, '</li>')
          des = des.replace(/\[sup\]/g, '<sup>').replace(/\[\/sup\]/g, '</sup>')
          des = des.replace(/\[sub\]/g, '<sub>').replace(/\[\/sub\]/g, '</sub>')
          des = des.replace(/\[a\]/g, '<a href="').replace(/\[\/a\]/g, '" target="_blank">ссылка</a>')
          des = des.replace(/\[a#\]/g, '<a name=&#34;"')
          des = des.replace(/\[-a\]/g, '<a href=&#34;#')
          des = des.replace(/\[notes\]/g, '<p class="notes">').replace(/\[\/notes\]/g, '</p>')
          des = des.replace(/\[s\]/g, '<s>').replace(/\[\/s\]/g, '</s>')
          des = des.replace(/\[blockquote\]/g, '<blockquote>').replace(/\[\/blockquote\]/g, '</blockquote>')
          des = des.replace(/\[img\]/g, '<div><img src="').replace(/\[\/img\]/g, '"></div>')
          this.description = des.replace(/\[i\]/g, '<i>').replace(/\[\/i\]/g, '</i>')

          const article = {
            title: this.title,
            description: this.description,
            promo: this.promo,
            image: this.image,
            dateUpd: new Date().toISOString().slice(0, 19).replace(/T/g, ' ').replace(/-/g, '.')
          }

          this.$store.dispatch('createArticle', article)
          .then(() => {
            this.$router.push('/listarticle')
          })
          .catch(() => {})
        }
      },
      upload () {
        this.$refs.fileInput.click()
      },
      onFileChange (event) {
        const files = event.target.files
        Object.keys(files).forEach(i => {
          const file = files[i]
          const reader = new FileReader()
          reader.onload = (e) => {
            this.imageSrc.push(reader.result)
          }
          reader.readAsDataURL(file)
          this.image.push(file)
        })
        console.log(this)
      }
    }
  }
</script>