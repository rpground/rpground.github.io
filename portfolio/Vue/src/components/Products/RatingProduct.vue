<template>
  <v-card-actions class="pa-3">
    Rate this album
    <v-spacer></v-spacer>
    <span class="grey--text text--lighten-2 caption mr-2">
      ({{ rating }})
    </span>
    <v-rating
      length=10
      v-model="rating"
      dense
      half-increments
      hover
      size="18"
      color="yellow darken-3"
    ></v-rating>
    <v-btn color="white" dark flat @click.native="editRating" v-if="!isOwner">Проголосовать</v-btn>
  </v-card-actions>
</template>

<script>
  export default {
    props: ['product'],
    data () {
      return {
        rating: this.product.rating.value
      }
    },
    computed: {
      isOwner () {
        return this.product.ownerId === this.$store.getters.user.id
      }
    },
    methods: {
      editRating () {
        console.log(this.$store.getters.user.id, this.rating)
        this.$store.dispatch('updateRating', {
          rating: {
            value: this.rating,
            user: this.$store.getters.user.id
          },
          id: this.product.id
        })
      }
    }
  }
</script>