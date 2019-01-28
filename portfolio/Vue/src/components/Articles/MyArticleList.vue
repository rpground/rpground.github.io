<template>
  <div>
    <v-container grid-list-lg>
      <v-layout row wrap v-if="!loading && myArticle.length !== 0">
        <v-flex
          xs12
          sm6
          md4
          v-for="(article, i) in myArticle"
          :key="i"
        >
          <v-card>
            <v-carousel height="250px">
              <router-link
                :aria-label="article.title"
                :to="'/article/'+article.id"
              >
                <v-carousel-item
                  v-for="(imageSrc, k) in myArticle[i].imageSrc"
                  :key="k"
                  :src="imageSrc"
                ></v-carousel-item> 
              </router-link>
            </v-carousel>

            <v-card-title primary-title>
              <div>
                <h3 class="mb-0">{{ article.title }}</h3>
                <div v-html="article.description.substring(0,200)"></div>
              </div>
            </v-card-title>

            <v-card-actions>
              <v-btn
                flat
                dark
                color="primary"
                outline
                :to="'/article/'+article.id"
              >Подробнее</v-btn>
              <v-btn flat color="orange">Explore</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout v-else-if="!loading && myArticle.length === 0">
        <v-flex xs12 class="text-xs-center">
          <h1 class="text--primary">You have no articles</h1>
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
  </div>
  
</template>

<script>
export default {
  computed: {
    myArticle () {
      return this.$store.getters.myArticle
    },
    loading () {
      return this.$store.getters.loading
    }
  }
}
</script>