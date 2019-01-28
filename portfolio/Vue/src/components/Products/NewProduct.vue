<template>
  <v-container>
    <v-layout row v-if="!loading">
      <v-flex xs12 sm8 offset-sm2>
        <h1 color="primary">Добавить новую игру</h1>            
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            name="title"
            label="Название"
            type="text"
            required
            v-model="title"
            :rules="[v => !!v || 'поле обязательно для заполнения']"
          ></v-text-field>

          <v-autocomplete
            id="authors"
            :items="base.authors"
            v-model="author"
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
                v-text="author && author.length === 0 ? 'done_outline' : 'add_circle'"
                @click="addElement('authors')"
              ></v-icon>
            </v-slide-x-reverse-transition>
          </v-autocomplete>

          <v-select
            :items="base.engines"
            label="Платформа"
            v-model="engine"
            required
          ></v-select>

          <v-select
            :items="base.genres"
            label="Жанр"
            v-model="genre"
            required
            multiple
          ></v-select>

          <v-select
            :items="base.settings"
            label="Сеттинг"
            v-model="setting"
            required
            multiple
          ></v-select>

          <v-autocomplete
            id="features"
            :items="base.features"
            v-model="feature"
            label="Особенности:"
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
                v-text="feature && feature.length !== 0 ? 'done_outline' : 'add_circle'"
                @click="addElement('features')"
              ></v-icon>
            </v-slide-x-reverse-transition>
          </v-autocomplete>

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
            color="primary"
            v-model="prepared"
            required
          ></v-slider>

          <v-menu
            v-if="prepared===100"
            :close-on-content-click="false"
            v-model="menuDateEnd"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
          >
            <v-text-field
              slot="activator"
              v-model="dateEnd"
              label="Дата выхода игры"
              prepend-icon="event"
              readonly
              required
            ></v-text-field>
            <v-date-picker v-model="dateEnd" @input="menuDateEnd = false"></v-date-picker>
          </v-menu>

          <v-textarea
            name="description"
            label="Описание"
            type="text"
            v-model="description"
            required
          ></v-textarea>

          <v-autocomplete
            id="graphics"
            :items="base.graphics"
            v-model="graphic"
            label="Графика, автор(ы) графики: "
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
                v-text="graphic && graphic.length !== 0 ? 'done_outline' : 'add_circle'"
                @click="addElement('graphics')"
              ></v-icon>
            </v-slide-x-reverse-transition>
          </v-autocomplete>

          <v-autocomplete
            id="graphicstyles"
            :items="base.graphicstyles"
            v-model="graphicstyle"
            label="Стиль графики:"
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
                v-text="graphicstyle && graphicstyle.length !== 0 ? 'done_outline' : 'add_circle'"
                @click="addElement('graphicstyles')"
              ></v-icon>
            </v-slide-x-reverse-transition>
          </v-autocomplete>

          <v-autocomplete
            id="musics"
            :items="base.musics"
            v-model="music"
            label="Музыка, автор(ы) музыки:"
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
                v-text="music && music.length !== 0 ? 'done_outline' : 'add_circle'"
                @click="addElement('musics')"
              ></v-icon>
            </v-slide-x-reverse-transition>
          </v-autocomplete>

          <v-autocomplete
            id="scripts"
            :items="base.scripts"
            v-model="script"
            label="Автор(ы) скриптов/плагинов:"
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
                v-text="script && script.length !== 0 ? 'done_outline' : 'add_circle'"
                @click="addElement('scripts')"
              ></v-icon>
            </v-slide-x-reverse-transition>
          </v-autocomplete>

          <v-autocomplete
            id="storys"
            :items="base.storys"
            v-model="story"
            label="Автор сюжета/диалогов:"
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
                v-text="story && story.length !== 0 ? 'done_outline' : 'add_circle'"
                @click="addElement('storys')"
              ></v-icon>
            </v-slide-x-reverse-transition>
          </v-autocomplete>

          <v-layout row>
            <v-flex xs7>
              <v-autocomplete
                id="trophys"
                :items="base.trophys"
                v-model="trophyName"
                label="Участие в конкурсах/призовые места:"
                persistent-hint
                return-object
              >
                <v-slide-x-reverse-transition
                  slot="append-outer"
                  mode="out-in"
                >
                  <v-icon
                    color="success"
                    v-text="trophyName && trophyName.length !== 0 ? 'done_outline' : 'add_circle'"
                    @click="addElement('trophys')"
                  ></v-icon>
                </v-slide-x-reverse-transition>
              </v-autocomplete>
            </v-flex>
            <v-flex xs2 offset-xs1>
              <v-autocomplete
                :items="base.Month"
                v-model="trophyMonth"
                label="месяц: "
                persistent-hint
                return-object
              ></v-autocomplete>
            </v-flex>

            <v-flex xs2 offset-xs1>
              <v-text-field
                label="год: "
                type="number"
                required
                v-model="trophyYear"
              ></v-text-field>
            </v-flex>           

            <v-flex xs2 offset-xs1>
              <v-text-field
                label="место: "
                type="number"
                required
                v-model="trophyPos"
              >
              <v-slide-x-reverse-transition
                slot="append-outer"
                mode="out-in"
              >
                <v-icon
                  color="success"
                  v-text="'add_box'"
                  @click="addTrophy(trophyName, trophyPos, trophyMonth, trophyYear)"
                ></v-icon>
              </v-slide-x-reverse-transition>
              </v-text-field>
            </v-flex>
          </v-layout>

          <v-flex xs8>
            <v-list-tile
              v-for="(item, k) in trophy"
              :key="k"
            >
              <v-list-tile-action>
                <v-icon
                  :color="(item.pos == 1) ? 'yellow' : (item.pos == 2) ? 'grey' : (item.pos == 3) ? 'orange' : 'brown'"
                  v-html="'filter_'+item.pos"
                >
                </v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title v-html="item.name"></v-list-tile-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-icon
                  color="red"
                  v-html="'delete'"
                  @click="deleteTrophy(k)"
                >
                </v-icon>
              </v-list-tile-action>

            </v-list-tile>
          </v-flex>

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
            label="Опубликовать на главной?"
            v-model="promo"
          ></v-switch>
          <v-spacer></v-spacer>
          <v-btn dark class="mt-3" color="primary" @click="upload">
            Скриншоты
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
        <v-layout>
          <v-btn
            :loading="loading"
            :disabled="!valid || !image"
            class="success"
            @click="createProduct"
          >Добавить игру</v-btn>
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

<style>
  >>>.v-input--selection-controls{
    padding-top: 0;
  }  
</style>

<script>
  export default {
    data () {
      return {
        isEditing: false,
        title: '',
        engine: '',
        author: null,
        genre: '',
        setting: '',
        date: new Date().toISOString().substr(0, 10),
        menuDate: false,
        description: '',
        image: [],
        imageSrc: [],
        prepared: null,
        promo: false,
        dateEnd: new Date().toISOString().substr(0, 10),
        menuDateEnd: false,
        feature: null,
        graphic: null,
        graphicstyle: null,
        music: null,
        script: null,
        story: null,
        trophyName: null,
        trophyMonth: null,
        trophyYear: null,
        trophyPos: null,
        site: null,
        download: null,
        valid: false,
        trophy: [],
        dateUpd: ''
      }
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
      deleteTrophy (i) {
        this.trophy.splice(i, 1)
      },
      addTrophy (name, pos, month, year) {
        console.log(this.$vuetify.theme.primary)
        if (name && pos) {
          this.trophy.push({name: name, pos: pos, month: month, year: year})
          this.trophyName = null
          this.trophyPos = null
          this.trophyMonth = null
          this.trophyYear = null
        }
      },
      addElement (id) {
        const el = document.querySelector('#' + id)
        if (!(id in this.base)) this.base[id] = []
        if (el.value) this.base[id].push(el.value)
        this.$store.dispatch('updateBase', {el: id, payload: this.base[id]})
      },
      deleteImg (i) {
        this.imageSrc.splice(i, 1)
      },
      createProduct () {
        if (this.$refs.form.validate() && this.image) {
          const product = {
            title: this.title,
            author: this.author,
            engine: this.engine,
            genre: this.genre,
            setting: this.setting,
            feature: this.feature,
            description: this.description,
            date: this.date,
            dateEnd: this.dateEnd,
            dateUpd: new Date().toISOString().slice(0, 19).replace(/T/g, ' ').replace(/-/g, '.'),
            graphic: this.graphic,
            graphicstyle: this.graphicstyle,
            music: this.music,
            script: this.script,
            story: this.story,
            trophy: this.trophy,
            site: this.site,
            download: this.download,
            prepared: this.prepared,
            image: this.image,
            promo: this.promo
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
      }
    }
  }
</script>