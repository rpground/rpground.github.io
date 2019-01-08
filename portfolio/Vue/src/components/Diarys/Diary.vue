<template>
  <div v-if="!loading">
    <v-parallax
      height="500"
      :src="diary.imageSrc[0]"
    ></v-parallax>
    <v-layout wrap row>
      <v-flex sm4 xs12>
        <v-btn flat class="mt-3" color="green" id="first" href="#editor">перейти к комментариям</v-btn>
      </v-flex>
      <v-flex sm8 xs12>
        <app-rating-diary :diary="diary"></app-rating-diary>
      </v-flex>
    </v-layout>

    <v-container>
      <v-flex offset-sm2 sm8 xs12>
        <app-user :id="diary.ownerId"></app-user>
        <v-card-title>
          <div v-if="isOwner" xs12 md8>
            <h1>{{ diary.title }}</h1>
            <div class="post-data mb-3 mt-1">{{diary.dateUpd}}</div>
          </div>
          <div v-else xs12 md12>
            <h1>{{ diary.title }}</h1>
            <div class="post-data mb-3 mt-1">{{diary.dateUpd}}</div>
          </div>
          <v-spacer></v-spacer>
          <div v-if="isOwner" xs12 md4>
            <app-edit-diary :diary="diary"></app-edit-diary>   
          </div>
        </v-card-title>

        <div id="diary" class="content card mb-4" v-html="diary.description"></div>

        <v-divider light></v-divider>

        <v-layout wrap row>
          <v-flex sm4 xs12>
            <v-btn flat color="green" href="#first">перейти в начало</v-btn>
          </v-flex>
          <v-flex sm8 xs12>
            <app-rating-diary :diary="diary"></app-rating-diary>
          </v-flex>
        </v-layout>
        <app-comment :state="diary"></app-comment>
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
import EditDiary from './EditDiary'
import RatingDiary from './RatingDiary'
export default {
  props: ['id'],
  computed: {
    diary () {
      const id = this.id
      return this.$store.getters.diaryById(id)
    },
    loading () {
      return this.$store.getters.loading
    },
    isOwner () {
      return this.diary.ownerId === this.$store.getters.user.id
    }
  },
  components: {
    appEditDiary: EditDiary,
    appRatingDiary: RatingDiary,
    appUser: User,
    appComment: Comment
  }
}
</script>

<style scoped>
  #diary {
    font-family:  medium-content-serif-font,Georgia,Cambria,"Times New Roman",Times,serif;
    font-weight: 400;
    font-style: normal;
    font-size: 20px;
    line-height: 1.9;
    letter-spacing: -.003em;
    color: #333;
    overflow-x: hidden;
  }
  #diary >>> h1 {
    font-family: 'Oranienbaum';
    font-size: 36px;
    line-height: 38px;
    font-weight: 700;
  }
  #diary >>>  ol, #diary >>>  ul {
    /*padding-left: 2em;*/
  }
  .#diary >>>  h3{
    font-family: 'Oranienbaum', serif;
    font-size: 32px;
    padding-bottom: 4px;
    margin: 0 0;
    border-bottom: 4px solid #00c8aa;
    line-height: 1;
  }
  #diary >>> h4{
    font-family: 'Oranienbaum', serif;
    font-size: 22px;
    margin: 0 0;
    display: block;
  }
  .v-btn--small{
    height: 18px;
    min-width: 50px;
  }
  .card >>> img{
    width: 100%;
  }
  #diary >>>  a {
    text-decoration: none;
    color: #00c8aa;
  }
  >>>.container {
    padding-top: 0;
  }
  #diary >>>  p {
    margin: 0 0;
  }
  #diary >>>  .notes{
    border-left: 6px solid #00c8aa;
    padding-left: 1em;
    margin: 0 1em;
    margin-left: 0;
    font-style: italic;
  }
  #diary >>>  blockquote {
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

