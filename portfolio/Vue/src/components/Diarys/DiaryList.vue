<template>
  <v-container grid-list-lg>
    <v-timeline v-if="!loading && diarys.length !== 0">
      <v-timeline-item
        v-for="(diary, i) in diarys"
        :key="i"
        color="primary lighten-2"
        large
      >
        <div slot="opposite">
          <span class="headline font-weight-bold primary--text">
            {{users.find(user => user.id === diary.ownerId).nick}}
          </span>
          <div class="grey--text">{{ diary.dateUpd.slice(0, 10) }}</div>
        </div>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card>
              <v-carousel height="250px">
                <router-link
                  :aria-label="diary.title"
                  :to="'/diary/'+diary.id"
                >
                  <v-img
                    :src="(diarys[i].imageSrc[0]) ? diarys[i].imageSrc[0] :'https://firebasestorage.googleapis.com/v0/b/gamebase-b0d78.appspot.com/o/articles%2F-LWwfGu44xazSFB64gbxRPG-Maker-MV.jpg?alt=media&token=09bd62bc-c8bb-4cb5-a1a9-ae2ad8a03f12'"
                  ></v-img> 
                </router-link>
              </v-carousel>

              <v-card-title primary-title>
                <div class="grey--text date">
                  {{users.find(user => user.id === diary.ownerId).nick}}
                </div>
                <v-spacer></v-spacer>
                <div class="grey--text date">
                  {{ diary.dateUpd.slice(0, 10) }}
                </div>
                <v-flex xs12>
                  <h3 class="b-2 headline font-weight-bold">{{ diary.title }}</h3>
                </v-flex>
                <v-flex xs12>
                  <div v-html="diary.description.substring(0,200)"></div>
                </v-flex>

                <v-btn
                  small
                  dark
                  outline
                  color="primary"
                  :to="'/diary/'+diary.id"
                >Подробнее</v-btn>
                <v-btn flat color="orange">Explore</v-btn>
              </v-card-title>
            </v-card>
          </v-flex>
        </v-layout>
      </v-timeline-item>
    </v-timeline>
    <v-layout v-else-if="!loading && diarys.length === 0">
      <v-flex xs12 class="text-xs-center">
        <h1 class="text--primary">You have no diarys</h1>
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

<script>
export default {
  computed: {
    diarys () {
      return this.$store.getters.diarys
    },
    loading () {
      return this.$store.getters.loading
    },
    users () {
      return this.$store.getters.users
    }
  }
}
</script>

<style scoped>
  .v-card >>> img{
    width: 100%;
  }
  .application--wrap {
    background-color: #eee;
  }
  .v-timeline-item {
    margin-top: -100px;
  }
  .v-timeline {
    margin-top: 100px;
  }
  @media (max-width: 600px) {
    >>> .v-timeline {
      margin-top: 0;
    }
    >>> .v-timeline-item {
      margin-top: 20px;
    }
    >>> .v-timeline-item__opposite {
      display: none;
    }
    >>> .v-timeline-item__body {
      max-width: 100%;
    }
  }
  @media (min-width: 600px) {
    .date {
      display: none;
    }
  }
  
</style>