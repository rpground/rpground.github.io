<template>
  <v-container fluid grid-list-xl>
    <v-tabs
      centered
      color="primary"
      dark
      icons-and-text
    >
      <v-tabs-slider color="orange"></v-tabs-slider>

      <v-tab v-for="el in select" :key="el.id">
        <v-select
          :items="el.arr"
          :label="el.name"
          v-model="baseFilter[el.model]"
          multiple
        >
          <template
            slot="selection"
            slot-scope="{ item, index }"
          >
            <span v-if="index === 0">{{ (item.length > 20) ? item.substring(0,20)+'...' : item }}</span>
            <span
              v-if="index === 1"
            >  (+{{ baseFilter[el.model].length - 1 }})</span>
          </template>
        </v-select>
        <!-- <v-select
          v-if="el.name=='Награды'"
          :items="base.Month"
          label="Месяц"
          v-model="el.model.month"
          multiple
        ></v-select> -->
      </v-tab>
    </v-tabs>
    <v-subheader>June</v-subheader>
    <v-layout row wrap v-if="!loading && products.length !== 0">
      <v-flex
        v-for="(product, i) in products"
        md12 xs12
        :key="i"
      >
        <v-card color="primary darken-2" class="white--text mt-3">   
          <v-layout row wrap>
            <v-flex class="contain" md4 xs12>
              <v-carousel height="260" dark>
                <router-link
                  :aria-label="product.title"
                  :to="'/product/'+product.id"
                >
                  <v-carousel-item
                    v-for="(imageSrc, k) in products[i].imageSrc"
                    :key="k"
                    :src="imageSrc"
                  ></v-carousel-item> 
                </router-link>
              </v-carousel>
            </v-flex>          
            
            <v-flex md3 xs12>
              <v-card-title>
                <div>           
                  <div>
                    <h3>Платформа: </h3>
                    <span>{{ product.engine }}</span>
                  </div>
                  <div>
                    <h3>Жанр: </h3>
                    <span v-for="(genre, i) in product.genre"
                      :key="i">
                      <span>{{ genre }} </span>
                    </span>
                  </div>
                  <div>
                    <h3>Сеттинг: </h3>
                    <span v-for="(setting, i) in product.setting"
                      :key="i">
                      <span>{{ setting }} </span>
                    </span>
                  </div>
                  <div v-if="product.feature">
                    <h3>Особенности: </h3>
                    <span v-for="(feature, i) in product.feature"
                      :key="i">
                      <span>{{ feature }} </span>
                    </span>
                  </div>
                  <div v-if="product.trophy">
                    <h3>Награды: </h3>
                    <span v-for="(trophy, i) in product.trophy"
                      :key="i">
                      <span>{{ trophy.name }} </span>
                    </span>
                  </div>
                  <div>
                    <h3>Готовность: </h3>
                    <span>{{ product.prepared }}%</span>
                  </div>
                </div>
              </v-card-title>
            </v-flex>
            <v-flex md5 xs12>
              <v-layout row wrap>
                <v-flex sm6 xs12>
                  <div class="headline">{{ product.title }}</div>
                  <span
                    v-for="(author, i) in product.author"
                    :key="i"
                  >
                    <span>{{ author }} </span>
                  </span>
                </v-flex>
                <v-flex sm6 xs12> 
                  <app-rating-product :product="product"></app-rating-product>
                </v-flex>
              </v-layout>
              <v-divider light></v-divider>
              <v-card-title primary-title>
                <div>
                  <v-list-tile-content>
                    <div v-html="product.description.substring(0,500)+'...'"></div>
                  </v-list-tile-content>
                </div>
              </v-card-title>
            </v-flex>            
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    
    <v-layout v-else-if="!loading && products.length === 0">
      <v-flex xs12 class="text-xs-center">
        <h1 class="text--primary">You have no products</h1>
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
import RatingProduct from './RatingProduct'
export default {
  data () {
    return {
      baseFilter: {}
    }
  },
  computed: {
    products () {
      let products = this.$store.getters.products
      let baseFilter = this.baseFilter
      for (let filter in baseFilter) {
        if (baseFilter[filter].length === 0) {
          delete baseFilter[filter]
        } else {
          products = products.filter((el) => {
            if (el[filter]) {
              el = el[filter]
              return baseFilter[filter].filter((baseEl) => {
                if (filter === 'trophy') el = el.map(e => e.name)
                return el.indexOf(baseEl) > -1
              }).length > 0
            }
          })
        }
      }
      return products
    },
    loading () {
      return this.$store.getters.loading
    },
    base () {
      return this.$store.getters.base
    },
    select () {
      let bases = [
        {name: 'Платформа', arr: this.base.engines, model: ['engine']},
        {name: 'Жанр', arr: this.base.genres, model: ['genre']},
        {name: 'Сеттинг', arr: this.base.settings, model: ['setting']},
        {name: 'Особенности', arr: this.base.features, model: ['feature']},
        {name: 'Графика', arr: this.base.graphics, model: ['graphic']},
        {name: 'Стиль графики', arr: this.base.graphicstyles, model: ['graphicstyle']},
        {name: 'Музыка', arr: this.base.musics, model: ['music']},
        {name: 'Скрипты', arr: this.base.scripts, model: ['script']},
        {name: 'Награды', arr: this.base.trophys, model: ['trophy']}
      ]
      return bases
    }
  },
  components: {
    appRatingProduct: RatingProduct
  }
}
</script>
<style scoped>
  h3 {
    display: inline-block;
  }
  .header-content {
    margin-top: -250px;
  }
  .v-btn--small{
    height: 18px;
    min-width: 50px;
  }
  >>>.v-expansion-panel__header {
    padding-left: 0;
  }
  .container.grid-list-xl .layout .flex .contain{
    padding-top: 0;
    padding-bottom: 0;
  }
</style>