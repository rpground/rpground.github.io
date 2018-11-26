<template>
  <v-container grid-list-lg>
    <v-timeline v-if="!loading && myDiary.length !== 0">
      <v-timeline-item
        v-for="(diary, i) in myDiary"
        :key="i"
        color="cyan lighten-2"
        large
      >
        <span slot="opposite">{{ diary.dateUpd.slice(0, 10) }}</span>
        <v-layout row wrap>
          <v-flex
            xs12
          >
            <v-card>
              <v-carousel height="250px">
                <router-link
                  :aria-label="diary.title"
                  :to="'/diary/'+diary.id"
                >
                  <v-carousel-item
                    v-for="(imageSrc, k) in myDiary[i].imageSrc"
                    :key="k"
                    :src="imageSrc"
                  ></v-carousel-item> 
                </router-link>
              </v-carousel>

              <v-card-title primary-title>
                <div>
                  <h3 class="mb-0">{{ diary.title }}</h3>
                  <div v-html="diary.description.substring(0,200)"></div>
                </div>
              </v-card-title>

              <v-card-actions>
                <v-btn
                  flat
                  dark
                  color="cyan"
                  outline
                  :to="'/diary/'+diary.id"
                >Подробнее</v-btn>
                <v-btn flat color="orange">Explore</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-timeline-item>
    </v-timeline>
    <v-layout v-else-if="!loading && myDiary.length === 0">
      <v-flex xs12 class="text-xs-center">
        <h1 class="text--primary">You have no diarys</h1>
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
    myDiary () {
      return this.$store.getters.myDiary
    },
    loading () {
      return this.$store.getters.loading
    }
  }
}
</script>

<style scoped>
  .application--wrap {
    background-color: #eee;
  }
  .v-timeline-item {
    margin-top: -100px;
  }
  .v-timeline {
    margin-top: 100px;
  }
</style>