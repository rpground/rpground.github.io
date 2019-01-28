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

<style type="text/css">
  * {
    word-wrap: break-word;
    word-break: break-word;
    -webkit-hyphens: auto;
    -moz-hyphens: auto;
    hyphens: auto;
  }
  .content{
    white-space: pre-wrap;
    line-height: 1.7;
    font-family:  medium-content-serif-font,Georgia,Cambria,"Times New Roman",Times,serif;
    font-weight: 400;
    font-size: 18px;
    font-style: normal;
    letter-spacing: -.003em;
    color: #333;    
  }
</style>