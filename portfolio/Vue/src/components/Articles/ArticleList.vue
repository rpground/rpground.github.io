<template>
  <div>
    <v-container grid-list-lg>
      <v-layout row wrap v-if="!loading && articles.length !== 0">
        <v-flex
          xs12
          sm6
          md4
          v-for="(article, i) in articles"
          :key="i"
        >
          <v-card>
            <v-carousel height="200px">
              <router-link
                :aria-label="article.title"
                :to="'/article/'+article.id"
              >
                <v-img
                  :src="(articles[i].imageSrc[0]) ? articles[i].imageSrc[0] : 'https://firebasestorage.googleapis.com/v0/b/gamebase-b0d78.appspot.com/o/articles%2F-LWwfGu44xazSFB64gbxRPG-Maker-MV.jpg?alt=media&token=09bd62bc-c8bb-4cb5-a1a9-ae2ad8a03f12'"
                ></v-img>
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
      <v-layout v-else-if="!loading && articles.length === 0">
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
    articles () {
      return this.$store.getters.articles
    },
    loading () {
      return this.$store.getters.loading
    }
  }
}
</script>

<style scoped>
  .v-card >>> img{
    width: 100%;
  }
</style>