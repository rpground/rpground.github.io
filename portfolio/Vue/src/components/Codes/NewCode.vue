<template>
  <v-container>
    <v-layout row v-if="!loading">
      <v-flex xs12 sm8 offset-sm2>
        <h1 color="primary">Добавить плагин, скрипт</h1>            
        <v-form ref="form" v-model="valid" lazy-validation>

          <v-text-field
            name="title"
            label="Название плагина"
            type="text"
            required
            v-model="title"
            :rules="[v => !!v || 'поле обязательно для заполнения']"
          ></v-text-field>

          <v-autocomplete
            id="scripts"
            :items="base.scripts"
            v-model="script"
            label="Автор:"
            persistent-hint
            multiple
            return-object
          >
            <v-slide-x-reverse-transition
              slot="append-outer"
              mode="out-in"
            >
              <v-icon
                color="success"
                v-text="script && script.length === 0 ? 'done_outline' : 'add_circle'"
                @click="addElement('scripts')"
              ></v-icon>
            </v-slide-x-reverse-transition>
          </v-autocomplete>

          <v-select
            :items="base.engines"
            label="Платформа"
            v-model="engine"
            required
          ></v-select>

          <v-autocomplete
            id="typescripts"
            :items="base.typescripts"
            v-model="typescript"
            label="Тип:"
            persistent-hint
            multiple
            return-object
          >
            <v-slide-x-reverse-transition
              slot="append-outer"
              mode="out-in"
            >
              <v-icon
                color="success"
                v-text="typescript && typescript.length === 0 ? 'done_outline' : 'add_circle'"
                @click="addElement('typescripts')"
              ></v-icon>
            </v-slide-x-reverse-transition>
          </v-autocomplete>

          <v-text-field
            name="version"
            label="Версия"
            type="text"
            v-model="version"
          ></v-text-field>

          <v-text-field
            name="site"
            label="Сайт игры/страница в соц.сетях"
            type="text"
            v-model="site"
          ></v-text-field>

          <v-text-field
            name="download"
            label="Ссылка для скачки"
            type="text"
            required
            v-model="download"
          ></v-text-field>

          <app-editor typeEditor="code" v-model="description" ref="Editor"></app-editor>
        </v-form>
        <v-layout>
          <v-flex xs12>
            <v-layout row wrap>
              <v-flex
                v-for="(n, i) in imageSrc"
                :key="i"
                :xs2="imageSrc.length%6===0"
                :xs4="imageSrc.length%3===0"
                :xs3="imageSrc.length%4===0 || imageSrc.length>6"
                d-flex
              >
                <v-card flat tile class="d-flex">
                  <v-img
                    :src="n"
                    aspect-ratio="1"
                    class="grey lighten-2"
                  >
                  <v-btn flat icon fab small  @click="deleteImg(i)">
                    <v-icon color="grey lighten-2">close</v-icon>
                    <v-layout
                      slot="placeholder"
                      fill-height
                      align-center
                      justify-center
                      ma-0
                    >
                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-layout>
                </v-btn>
                  </v-img>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-switch
            color="success"
            label="Add to Promo?"
            v-model="promo"
          ></v-switch>
          <v-spacer></v-spacer>
          <v-btn dark class="mt-3" color="primary" @click="upload">
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
        </v-layout>
        <v-layout row>
          <v-flex xs12>
            <v-spacer></v-spacer>
            <v-btn
              :loading="loading"
              :disabled="!valid || !image"
              class="success"
              @click="createCode"
            >Create Code</v-btn>
          </v-flex>
        </v-layout>                
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
  </v-container>
</template>

<script>
  import Editor from '../Editor'
  export default {
    data () {
      return {
        title: '',
        description: '',
        engine: '',
        script: null,
        typescript: null,
        version: null,
        site: null,
        download: null,
        image: [],
        imageSrc: [],
        promo: false,
        valid: false,
        dateUpd: ''
      }
    },
    components: {
      appEditor: Editor
    },
    computed: {
      loading () {
        return this.$store.getters.loading
      },
      base () {
        return this.$store.getters.base
      }
    },
    methods: {
      addElement (id) {
        const el = document.querySelector('#' + id)
        if (!(id in this.base)) this.base[id] = []
        if (el.value) this.base[id].push(el.value)
        this.$store.dispatch('updateBase', {el: id, payload: this.base[id]})
      },
      deleteImg (i) {
        this.imageSrc.splice(i, 1)
        console.log(this.imageSrc)
      },
      createCode () {
        if (this.$refs.form.validate() && this.image) {
          this.$refs.Editor.editTagDescription(this.description)
          const code = {
            title: this.title,
            description: this.description,
            script: this.script,
            version: this.version,
            typescript: this.typescript,
            engine: this.engine,
            promo: this.promo,
            image: this.image,
            dateUpd: new Date().toISOString().slice(0, 19).replace(/T/g, ' ').replace(/-/g, '.')
          }

          this.$store.dispatch('createCode', code)
          .then(() => {
            this.$router.push('/listcode')
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
      }
    }
  }
</script>