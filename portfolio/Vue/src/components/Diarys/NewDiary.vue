<template>
  <v-container>
    <v-layout row v-if="!loading">
      <v-flex xs12 sm8 offset-sm2>
        <h1 color="primary">Добавить новый дневник</h1>            
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

          <app-editor typeEditor="diary" ref="Editor" v-model="description"></app-editor>
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
              @click="createDiary"
            >Create Diary</v-btn>
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
      }
    },
    methods: {
      deleteImg (i) {
        this.imageSrc.splice(i, 1)
      },
      createDiary () {
        if (this.$refs.form.validate() && this.image) {
          this.$refs.Editor.editTagDescription(this.description)
          const diary = {
            title: this.title,
            description: this.description,
            promo: this.promo,
            image: this.image,
            dateUpd: new Date().toISOString().slice(0, 19).replace(/T/g, ' ').replace(/-/g, '.')
          }

          this.$store.dispatch('createDiary', diary)
          .then(() => {
            this.$router.push('/listdiary')
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