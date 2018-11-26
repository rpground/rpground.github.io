<template>
  <div v-if="!loading">
    <v-parallax
      height="400"
      :src="article.imageSrc[0]"
    ></v-parallax>

    <app-rating-article :article="article"></app-rating-article>

    <v-container>
      <v-flex offset-sm2 sm8 xs12>
        <app-user></app-user>

        <h1>{{ article.title }}</h1>
        <div class="post-data mb-3 mt-1">{{article.dateUpd}}</div>

        <div class="card" v-html="article.description"></div>

        <div class="mt-3">
          <app-edit-article :article="article" v-if="isOwner"></app-edit-article>
        </div>  
        <v-divider light></v-divider>

        <app-rating-article :article="article"></app-rating-article>
      </v-flex>
    </v-container>
  </div>
  <v-container v-else xs12 class="text-xs-center pt-5">
    <v-progress-circular
      :size="50"
      :width="4"
      color="cyan"
      indeterminate
    ></v-progress-circular>        
  </v-container>
</template>

<style scoped>
  .card {
    font-family:  medium-content-serif-font,Georgia,Cambria,"Times New Roman",Times,serif;
    font-weight: 400;
    font-style: normal;
    font-size: 20px;
    line-height: 1.9;
    letter-spacing: -.003em;
    color: #333;
    overflow-x: hidden;
  }
  h1 {
    font-family: 'Oranienbaum';
    font-size: 36px;
    line-height: 38px;
    font-weight: 700;
  }
  .card >>> ol, .card >>> ul {
    border-left: 2px solid #00c8aa;
    padding-left: 2em;
  }
  .card >>> h3{
    font-family: 'Oranienbaum', serif;
    font-size: 32px;
    padding-bottom: 4px;
    margin: 20px 0;
    border-bottom: 4px solid #00c8aa;
    line-height: 1;
  }
  .card >>> h4{
    font-family: 'Oranienbaum', serif;
    font-size: 22px;
    margin: 20px 0;
    display: block;
  }
  .v-btn--small{
    height: 18px;
    min-width: 50px;
  }
  .card img{
    width: 100%;
    margin-left: -100px;
  }
  >>> a {
    text-decoration: none;
    color: #00c8aa;
  }
  >>>.container {
    padding-top: 0;
  }
  >>> p {
    margin: 32px 0;
  }
  >>> blockquote{
    border-left: 6px solid #00c8aa;
    padding-left: 1em;
    margin: 1em;
    margin-left: 0;
    font-style: italic;
  }
  >>> .notes {
    margin: 1em 0 2em;
    padding: 1em;
    font-size: 18px;
    line-height:  1.5;
    background-color: #eee;
  }
  .post-data{
    opacity: .54;
    font-size: 12px;
  }
</style>

<script>
import User from '../User'
import EditArticle from './EditArticle'
import RatingArticle from './RatingArticle'

export default {
  props: ['id'],
  computed: {
    article () {
      const id = this.id
      return this.$store.getters.articleById(id)
    },
    loading () {
      return this.$store.getters.loading
    },
    isOwner () {
      return this.article.ownerId === this.$store.getters.user.id
    }
  },
  components: {
    appEditArticle: EditArticle,
    appRatingArticle: RatingArticle,
    appUser: User
  }
}
</script>

