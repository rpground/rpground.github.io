<template>
  <div v-if="!loading">
    <v-layout row>
      <v-flex xs12>
        <template>
          <v-carousel>  
            <v-carousel-item
              v-for="(product, i) in promoProducts"
              :key="i"
              :src="product.imageSrc[0]"
              @click="toProduct(product.id)"
            ></v-carousel-item>           
          </v-carousel>
        </template>
      </v-flex>
    </v-layout>

    <v-container grid-list-lg>
      <v-layout row wrap>
        <v-flex
          xs12
          sm6
          v-for="(product, i) in products"
          :key="i"         
        >
          <v-hover>
            <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`">
              <v-carousel height="250px">
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

              <v-card-title primary-title>
                <div>
                  <h3 class="mb-0">{{ product.title }}</h3>
                  <div>{{product.description.substring(0,200)}}</div>
                </div>
              </v-card-title>

              <v-card-actions>
                <v-btn
                  class="mb-2"
                  color="success"
                  :to="'/product/'+product.id"
                >Подробнее</v-btn>
                <v-spacer></v-spacer>
                <app-add-review class="mb-2" :product="product"></app-add-review>
              </v-card-actions>
            </v-card>
          </v-hover>
        </v-flex>
      </v-layout>    
    </v-container>    
  </div>
  <div v-else>
    <v-container>
      <v-layout row>
        <v-flex xs12 class="text-xs-center pt-5">
           <v-progress-circular
            :size="50"
            :width="4"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </v-flex>
      </v-layout>
    </v-container>
  </div>  
  
</template>

<script>
export default {
  methods: {
    toProduct (id) {
      this.$router.push('/product/' + id)
    }
  },
  computed: {
    promoProducts () {
      return this.$store.getters.promoProducts
    },
    products () {
      return this.$store.getters.products
    },
    loading () {
      return this.$store.getters.loading
    }
  }
}
</script>