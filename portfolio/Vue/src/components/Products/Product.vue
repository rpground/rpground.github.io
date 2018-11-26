<template>
  <v-container>
    <v-card>
      <v-container
        fluid
        grid-list-lg
        v-if="!loading"
      >
        <v-layout row wrap>
          <v-flex xs12>
            <v-card color="cyan darken-2" class="white--text">
              <v-layout row wrap>
                <v-flex sm6 xs12 class="pt-0 pb-0">
                  <v-carousel>
                    <router-link
                      :aria-label="product.title"
                      :to="'/product/'+product.id"
                    >
                      <v-carousel-item
                        v-for="(imageSrc, k) in product.imageSrc"
                        :key="k"
                        :src="imageSrc"
                      ></v-carousel-item>
                    </router-link>
                  </v-carousel>
                </v-flex>
                <v-flex sm6 xs12>
                  <v-card-title primary-title>
                    <div>
                      <div class="headline">{{ product.title }}</div>
                      <v-tooltip bottom>
                        <div slot="activator">{{ product.dateUpd.slice(0, 10) }}</div>
                        <span>Автор</span>
                      </v-tooltip>

                      <div class="mt-3">
                        <h3>Автор: </h3>
                        <span v-for="(author, i) in product.author"
                          :key="i">
                          <span>{{ author }} </span>
                        </span>
                      </div>                      
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
                      <div>
                        <h3>Дата обновления: </h3>
                        <span>{{ product.date }}</span>
                      </div>
                      <div>
                        <h3>Процент готовности: </h3>
                        <span>{{ product.prepared }} % <v-progress-linear color="orange" v-model="product.prepared"> % </v-progress-linear></span>
                      </div>
                      <div>
                        <h3>Описание: </h3>
                        <div>{{ product.description }}</div>
                      </div>
                      <div class="mt-3">
                        <app-edit-product :product="product" v-if="isOwner"></app-edit-product>
                        <app-add-review :product="product"></app-add-review>
                      </div>
                    </div>
                  </v-card-title>
                </v-flex>
              </v-layout>
              <v-divider light></v-divider>

              <app-rating-product :product="product"></app-rating-product>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container v-else xs12 class="text-xs-center pt-5">
        <v-progress-circular
          :size="50"
          :width="4"
          color="cyan"
          indeterminate
        ></v-progress-circular>        
      </v-container>
    </v-card>
  </v-container>
</template>

<style scoped>
  h3 {
    display: inline-block;
  }
  .v-btn--small{
    height: 18px;
    min-width: 50px;
  }
</style>

<script>
import EditProduct from './EditProduct'
import RatingProduct from './RatingProduct'
export default {
  props: ['id'],
  computed: {
    product () {
      const id = this.id
      return this.$store.getters.productById(id)
    },
    loading () {
      return this.$store.getters.loading
    },
    isOwner () {
      return this.product.ownerId === this.$store.getters.user.id
    }
  },
  components: {
    appEditProduct: EditProduct,
    appRatingProduct: RatingProduct
  }
}
</script>

