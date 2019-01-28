<template>
  <div v-if="!loading">
    <v-parallax
      height="500"
      :src="(code.imageSrc[0]) ? code.imageSrc[0] :'https://firebasestorage.googleapis.com/v0/b/gamebase-b0d78.appspot.com/o/articles%2F-LWwfGu44xazSFB64gbxRPG-Maker-MV.jpg?alt=media&token=09bd62bc-c8bb-4cb5-a1a9-ae2ad8a03f12'"
    >
      <v-layout
        class="bgdark"
        align-center
        column
        justify-center
      >
        <h1 class="display-3 mb-3">{{ code.title }}</h1>
        <h4 class="subheading">{{ (code.tag) ? code.tag : '' }}</h4>
      </v-layout>
    </v-parallax>

    <v-layout wrap row>
      <v-flex sm6 xs12>
        <v-btn flat color="green" href="#editor">перейти к комментариям</v-btn>
      </v-flex>
      <v-flex sm6 xs12>
        <app-rating-code :code="code"></app-rating-code>
      </v-flex>
    </v-layout>

    <v-container>
      <v-flex offset-sm2 sm8 xs12>
        <app-user :id="code.ownerId"></app-user>
        <v-card-title primary-title>
          <div v-if="isOwner" xs12 md8>
            <h1>{{ code.title }}</h1>
            <div class="post-data mb-3 mt-1">{{code.dateUpd}}</div>
          </div>
          <div v-else xs12 md12>
            <h1>{{ code.title }}</h1>
            <div class="post-data mb-3 mt-1">{{code.dateUpd}}</div>
          </div>
          <v-spacer></v-spacer>
          <div v-if="isOwner" xs12 md4>
            <app-edit-code :code="code"></app-edit-code>   
          </div>
        </v-card-title>

        <div id="code" class="content card mb-4" v-html="code.description"></div>

        <v-divider light></v-divider>

        <v-layout wrap row>
          <v-flex sm4 xs12>
            <v-btn flat color="green" href="#first">перейти в начало</v-btn>
          </v-flex>
          <v-flex sm8 xs12>
            <app-rating-code :code="code"></app-rating-code>
          </v-flex>
        </v-layout>
        <app-comment :state="code"></app-comment>
      </v-flex>
    </v-container>
  </div>
  <v-container v-else xs12 class="text-xs-center pt-5">
    <v-progress-circular
      :size="50"
      :width="4"
      color="primary"
      indeterminate
    ></v-progress-circular>        
  </v-container>
</template>

<script>
import User from '../User'
import Comment from '../Comment'
import EditCode from './EditCode'
import RatingCode from './RatingCode'
export default {
  props: ['id'],
  computed: {
    code () {
      const id = this.id
      return this.$store.getters.codeById(id)
    },
    loading () {
      return this.$store.getters.loading
    },
    isOwner () {
      return this.code.ownerId === this.$store.getters.user.id
    }
  },
  components: {
    appEditCode: EditCode,
    appRatingCode: RatingCode,
    appUser: User,
    appComment: Comment
  }
}
</script>

<style scoped>
  .bgdark{
    background-color:rgba(0,0,0,.5);
    height:100%;
    position:absolute;
    width:100%;
    top:0;
    left:0;
  }
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
  .content >>>  ol, #code >>>  ul {
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

