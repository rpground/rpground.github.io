<template>
  <v-container grid-list-lg>
    <v-layout row wrap v-if="!loading && myProducts.length !== 0">
      <v-flex
        xs12
        sm6
        v-for="(product, i) in myProducts"
        :key="i"
      >
        <v-card>
          <v-carousel height="250px">
            <router-link
              :aria-label="product.title"
              :to="'/product/'+product.id"
            >
              <v-carousel-item
                v-for="(imageSrc, k) in myProducts[i].imageSrc"
                :key="k"
                :src="imageSrc"
              ></v-carousel-item> 
            </router-link>
          </v-carousel>

          <v-card-title primary-title>
            <div>
              <h3 class="mb-0">{{ product.title }}</h3>
              <div v-html="product.description.substring(0,200)"></div>
            </div>
          </v-card-title>

          <v-card-actions>
            <v-btn
              flat
              dark
              color="cyan"
              outline
              :to="'/product/'+product.id"
            >Подробнее</v-btn>
            <v-btn flat color="orange">Explore</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout v-else-if="!loading && myProducts.length === 0">
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
export default {
  computed: {
    myProducts () {
      return this.$store.getters.myProducts
    },
    loading () {
      return this.$store.getters.loading
    }
  }
}
</script>