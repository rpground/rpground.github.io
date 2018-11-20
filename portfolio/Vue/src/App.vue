<template>
  <v-app>
    <Navbar/>
    <v-content/>
    <template v-if="error">
      <v-snackbar
        :multi-line="true"
        :timeout="5000"
        color="error"
        @input="closeError"
        :value="true"
      >
        {{ error }}
        <v-btn
          dark
          flat
          @click="closeError"
        >
          Close
        </v-btn>
      </v-snackbar>     
    </template>
    <Footer/>
  </v-app>
</template>

<script>
  import Navbar from './components/Navbar.vue'
  import Footer from './components/Footer.vue'
  export default {
    components: {
      Navbar,
      Footer
    },
    methods: {
      closeError () {
        this.$store.dispatch('clearError')
      }
    },
    computed: {
      error () {
        return this.$store.getters.error
      }
    }
  }
</script>
