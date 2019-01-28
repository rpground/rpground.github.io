<template>
  <v-card-actions class="pa-3">
    <v-spacer class="xs-none"></v-spacer>
    <v-tooltip bottom>
      <span class="grey--text text--lighten-1 caption mr-2 xs-none" slot="activator">
        ({{ rating.toFixed(2) }})
      </span>
      <span>рейтинг статьи</span>
    </v-tooltip>
    <v-tooltip bottom>
      <v-rating
        length=10
        v-model="rating"
        dense
        half-increments
        hover
        size="18"
        color="yellow darken-3"
        slot="activator"
      ></v-rating>
      <span>{{ myRatingText }}</span>
    </v-tooltip>
    <v-spacer class="xs-display"></v-spacer>
    <v-btn color="primary" dark flat @click.native="editRating" v-if="!isOwner">Голосовать</v-btn>
  </v-card-actions>
</template>

<script>
  export default {
    props: ['code'],
    data () {
      return {
        newRating: 0
      }
    },
    computed: {
      isOwner () {
        return this.code.ownerId === this.$store.getters.user.id
      },
      ratings () {
        return this.code.rating ? this.code.rating : []
      },
      myRating () {
        const myRating = this.ratings.find(el => el.user === this.$store.getters.user.id)
        return (myRating) ? myRating.value : 0
      },
      myRatingText () {
        if (this.myRating) {
          return 'Моя оценка: ' + this.myRating
        } else {
          return this.isOwner ? 'не могу голосовтаь за свою статью' : 'еще не оценил'
        }
      },
      rating: {
        get: function () {
          let rating = this.ratings
          const length = this.ratings.length || 1
          rating = rating.reduce((sum, current) => {
            return sum + current.value
          }, 0)
          return rating / length
        },
        set: function (rating) {
          this.newRating = rating
        }
      }
    },
    methods: {
      editRating () {
        this.$store.dispatch('updateRatingCode', {
          value: this.newRating,
          rating: this.ratings,
          id: this.code.id
        })
      }
    }
  }
</script>

<style scope>
  @media (max-width: 600px) {
    .xs-none {
      display: none;
    }
    .v-btn__content {
      font-size: 9px;
    }
  }
  @media (min-width: 600px) {
    .xs-display {
      display: none;
    }
  }
</style>