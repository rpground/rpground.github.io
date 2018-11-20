<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 class="text-xs-center pt-5" v-if="loading">
        <v-progress-circular
            :size="100"
            :width="4"
            color="cyan"
            indeterminate
        ></v-progress-circular> 
      </v-flex>      
      <v-flex xs12 sm6 offset-sm3 v-else-if="!loading && reviews.length !== 0">
        <h1 class="mb3">Orders</h1>
        <v-list
          subheader
          two-line
        >
          <v-list-tile 
            avatar
            v-for="(review, i) in reviews"
            :key="i"            
          >
            <v-list-tile-action>
              <v-checkbox
                color="success"
                :input-value="review.done"
                @change="markDone(review)"
              >
                
              </v-checkbox>
            </v-list-tile-action>

            <v-list-tile-content >
              <v-list-tile-title>{{ review.reviewGraphic }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ review.reviewGameplay }}</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn
                color="cyan"
                :to="'/product/'+review.productId"
              >Open</v-btn>
            </v-list-tile-action>
          </v-list-tile>

        
        </v-list>
      </v-flex>
      <v-flex xs12 class="text-xs-center" v-else>
        <h1 class="text--secondary">You have no orders</h1>
      </v-flex>       
    </v-layout>
  </v-container>
</template>

<script>
export default {
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    reviews () {
      return this.$store.getters.reviews
    }
  },
  methods: {
    markDone (review) {
      this.$store.dispatch('markOrderDone', review.id)
      .then(() => {
        review.done = true
      })
      .catch(() => {})
    }
  },
  created () {
    this.$store.dispatch('fetchReview')
  }
}
</script>