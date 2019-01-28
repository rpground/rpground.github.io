<template>
  <div>
    <v-container grid-list-lg>
      <v-layout row wrap v-if="!loading && myCode.length !== 0">
        <v-flex
          xs12
          sm6
          md4
          v-for="(code, i) in myCode"
          :key="i"
        >
          <v-card>
            <v-carousel height="250px">
              <router-link
                :aria-label="code.title"
                :to="'/code/'+code.id"
              >
                <v-carousel-item
                  v-for="(imageSrc, k) in myCode[i].imageSrc"
                  :key="k"
                  :src="imageSrc"
                ></v-carousel-item> 
              </router-link>
            </v-carousel>

            <v-card-title primary-title>
              <div>
                <h3 class="mb-0">{{ code.title }}</h3>
                <div v-html="code.description.substring(0,200)"></div>
              </div>
            </v-card-title>

            <v-card-actions>
              <v-btn
                flat
                dark
                color="primary"
                outline
                :to="'/code/'+code.id"
              >Подробнее</v-btn>
              <v-btn flat color="orange">Explore</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout v-else-if="!loading && myCode.length === 0">
        <v-flex xs12 class="text-xs-center">
          <h1 class="text--primary">You have no codes</h1>
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
    myCode () {
      return this.$store.getters.myCode
    },
    loading () {
      return this.$store.getters.loading
    }
  }
}
</script>