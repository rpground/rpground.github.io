<template>
  <v-container>
    <v-layout row v-if="!loading">
      <v-flex xs12 sm6 offset-sm3>
        <h1 color="cyan">Create New Product</h1>            
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            name="title"
            label="Title"
            type="text"
            required
            v-model="title"
            :rules="[v => !!v || 'поле обязательно для заполнения']"
          ></v-text-field>
          <v-autocomplete
            :items="authors"
            v-model="author"
            label="Автор:"
            persistent-hint
            multiple
          >
            <v-slide-x-reverse-transition
              slot="append-outer"
              mode="out-in"
            >
            </v-slide-x-reverse-transition>
          </v-autocomplete>
          <v-select
            :items="engines"
            label="Engine"
            v-model="engine"
            required
          ></v-select>
          <v-select
            :items="genres"
            label="Genre"
            v-model="genre"
            required
            multiple
          ></v-select>
          <v-select
            :items="settings"
            label="Setting"
            v-model="setting"
            required
            multiple
          ></v-select>
          <v-textarea
            name="description"
            label="Description"
            type="text"
            v-model="description"
            required
          ></v-textarea>
          <v-menu
            :close-on-content-click="false"
            v-model="menuDate"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
          >
            <v-text-field
              slot="activator"
              v-model="date"
              label="Дата начала разработки"
              prepend-icon="event"
              readonly
              required
            ></v-text-field>
            <v-date-picker v-model="date" @input="menuDate = false"></v-date-picker>
          </v-menu>
          <v-slider
            label="Процент готовности"
            :max="100"
            :min="0"
            thumb-label="always"
            color="cyan"
            v-model="prepared"
            required
          ></v-slider>     
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
              @click="createProduct"
            >Create Product</v-btn>
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
        engines: ['RPG maker MV', 'RPG maker VA Ace', 'RPG maker XP', 'RPG maker 2003', 'RPG maker VX', 'RPG maker 2000'],
        engine: '',
        isEditing: false,
        authors: ['Yuryol', 'Imaginatium'],
        author: null,
        genres: ['JRPG', 'Tactics', 'Action', 'RPG', 'Adventure', 'Puzzle', 'Fighting', 'Platformer', 'Visual novel', 'Text game', 'Rougelike', 'Arcade', 'Dungeon crawler', 'Shooter', 'Sidescroller', 'Simulation', 'Strategy'],
        genre: '',
        settings: ['Ciberpunk', 'Fantasy', 'Comedy', 'Dark', 'Futuristic', 'Historical', 'Horror', 'Modern', 'Multiplayer', 'Mystery', 'Music', 'Noir', 'Oldscool', 'Post-apocaliptic', 'Sci-fi', 'Steampunk', 'Western'],
        setting: '',
        date: new Date().toISOString().substr(0, 10),
        menuDate: false,
        description: '',
        image: [],
        imageSrc: [],
        prepared: null,
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
      createProduct () {
        if (this.$refs.form.validate() && this.image) {
          // logic
          const product = {
            title: this.title,
            author: this.author,
            engine: this.engine,
            genre: this.genre,
            setting: this.setting,
            date: this.date,
            description: this.description,
            prepared: this.prepared,
            promo: this.promo,
            image: this.image,
            dateUpd: new Date().toISOString().slice(0, 19).replace(/T/g, ' ').replace(/-/g, '.')
          }

          this.$store.dispatch('createProduct', product)
          .then(() => {
            this.$router.push('/list')
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