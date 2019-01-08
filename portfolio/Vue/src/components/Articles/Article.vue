<template>
  <div v-if="!loading">
    <v-parallax
      height="500"
      :src="article.imageSrc[0]"
    ></v-parallax>

    <v-layout wrap row>
      <v-flex sm6 xs12>
        <v-btn flat color="green" href="#editor">перейти к комментариям</v-btn>
      </v-flex>
      <v-flex sm6 xs12>
        <app-rating-article :article="article"></app-rating-article>
      </v-flex>
    </v-layout>

    <v-container>
      <v-flex offset-sm2 sm8 xs12>
        <app-user :id="article.ownerId"></app-user>
        <v-card-title primary-title>
          <div v-if="isOwner" xs12 md8>
            <h1>{{ article.title }}</h1>
            <div class="post-data mb-3 mt-1">{{article.dateUpd}}</div>
          </div>
          <div v-else xs12 md12>
            <h1>{{ article.title }}</h1>
            <div class="post-data mb-3 mt-1">{{article.dateUpd}}</div>
          </div>
          <v-spacer></v-spacer>
          <div v-if="isOwner" xs12 md4>
            <app-edit-article :article="article"></app-edit-article>   
          </div>
        </v-card-title>

        <div id="article" class="content card mb-4" v-html="article.description"></div>

        <v-divider light></v-divider>

        <v-layout wrap row>
          <v-flex sm6 xs12>
            <v-btn flat color="green" href="#first">перейти в начало</v-btn>
          </v-flex>
          <v-flex sm6 xs12>
            <app-rating-article :article="article"></app-rating-article>
          </v-flex>
        </v-layout>
        <app-comment :state="article"></app-comment>
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

<script>
import User from '../User'
import Comment from '../Comment'
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
    appUser: User,
    appComment: Comment
  }
}
</script>

<style scoped>
  .content {
    font-family:  medium-content-serif-font,Georgia,Cambria,"Times New Roman",Times,serif;
    font-weight: 400;
    font-style: normal;
    font-size: 20px;
    line-height: 1.9;
    letter-spacing: -.003em;
    color: #333;
    overflow-x: hidden;
  }
  .content >>> h1 {
    font-family: 'Oranienbaum';
    font-size: 36px;
    line-height: 38px;
    font-weight: 700;
  }
  .content >>>  ol, #article >>>  ul {
    /*padding-left: 2em;*/
  }
  .content >>>  h3{
    font-family: 'Oranienbaum', serif;
    font-size: 32px;
    padding-bottom: 4px;
    margin: 0 0;
    border-bottom: 4px solid #00c8aa;
    line-height: 1;
  }
  .content >>> h4{
    font-family: 'Oranienbaum', serif;
    font-size: 22px;
    margin: 0 0;
    display: block;
  }
  .v-btn--small{
    height: 18px;
    min-width: 50px;
  }
  .card >>> img, .text_input  >>> img{
    width: 100%;
  }
  .content >>>  a {
    text-decoration: none;
    color: #00c8aa;
  }
  >>>.container {
    padding-top: 0;
  }
  .content >>>  p {
    margin: 0 0;
  }
  .content >>>  .notes{
    border-left: 6px solid #00c8aa;
    padding-left: 1em;
    margin: 0 1em;
    margin-left: 0;
    font-style: italic;
  }
  .content >>>  blockquote {
    margin: 0 0 0;
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

