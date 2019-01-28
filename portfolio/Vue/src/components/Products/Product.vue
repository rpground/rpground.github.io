<template>
  <div v-if="!loading">
    <v-parallax
      id="first"
      height="500"
      :src="(product.imageSrc[0]) ? product.imageSrc[0] :'https://firebasestorage.googleapis.com/v0/b/gamebase-b0d78.appspot.com/o/articles%2F-LWwfGu44xazSFB64gbxRPG-Maker-MV.jpg?alt=media&token=09bd62bc-c8bb-4cb5-a1a9-ae2ad8a03f12'"
    >
      <v-layout
        class="bgdark"
        align-center
        column
        justify-center
      >
        <h1 class="display-3 mb-3">{{ product.title }}</h1>
        <h4 class="subheading">{{ (product.tag) ? product.tag : '' }}</h4>
      </v-layout>
    </v-parallax>
    <v-flex xs12>
      <v-card color="primary darken-2" class="white--text">
        <v-layout row wrap>

          
        </v-layout>
        <v-divider light></v-divider>
        <div class="userProduct" style="font-size: 22px">
          <app-user :id="product.ownerId"></app-user>            
        </div>
        <v-layout row wrap>
          <v-flex sm6 xs12> 
            <div class="mt-2">
              <app-edit-product :product="product" v-if="isOwner"></app-edit-product>
              <v-spacer></v-spacer>
              <!-- <app-add-review :product="product"  v-if="!isOwner && isReviewOwner"></app-add-review> -->
              <app-add-review :product="product"  v-if="!isOwner"></app-add-review>
            </div>
          </v-flex>
          <v-flex sm6 xs12> 
            <app-rating-product :product="product"></app-rating-product>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
    <v-container>
      <v-flex offset-md2 md8 xs12>
<v-flex xs12>
            <v-card-title primary-title>
              <div>
                <div class="headline">{{ product.title }}</div>
                <v-tooltip bottom>
                  <div slot="activator">{{ product.dateUpd.slice(0, 10) }}</div>
                  <span>Автор</span>
                </v-tooltip>

                <div class="mt-3">
                  <h3>Автор: </h3>
                  <span v-for="(author, i) in product.author"
                    :key="i">
                    <span>{{ author }} </span>
                  </span>
                </div>                      
                <div>
                  <h3>Платформа: </h3>
                  <span>{{ product.engine }}</span>
                </div>
                <div>
                  <h3>Жанр: </h3>
                  <span v-for="(genre, i) in product.genre"
                    :key="i">
                    <span>{{ genre }} </span>
                  </span>
                </div>
                <div>
                  <h3>Сеттинг: </h3>
                  <span v-for="(setting, i) in product.setting"
                    :key="i">
                    <span>{{ setting }} </span>
                  </span>
                </div>
                <div>
                  <h3>Дата обновления: </h3>
                  <span>{{ product.date }}</span>
                </div>
                <div v-if="product.graphics">
                  <h3>Графика: </h3>
                  <span v-for="(graphic, i) in product.graphics"
                    :key="i">
                    <span>{{ graphic }} </span>
                  </span>
                </div>
                <div v-if="product.features">
                  <h3>Особенности: </h3>
                  <span v-for="(feature, i) in product.features"
                    :key="i">
                    <span>{{ feature }} </span>
                  </span>
                </div>
                <div>
                  <h3>Процент готовности: </h3>
                  <span>{{ product.prepared }} % <v-progress-linear color="orange" v-model="product.prepared"> % </v-progress-linear></span>
                </div>
                <div>
                  <h3>Описание: </h3>
                  <div>{{ product.description }}</div>
                </div>
              </div>
            </v-card-title>
          </v-flex>        
        <v-tabs
          centered
          color="primary"
          dark
          icons-and-text
        >
          <v-tabs-slider color="orange"></v-tabs-slider>

          <v-tab
            v-for="(item, i) in base"
            :key="i"
            :href="'#tab-' + i"
          >
            {{ item.name }}
            <v-icon>{{item.icon}}</v-icon>
          </v-tab>

          <v-tab-item
            v-for="(item, i) in base"
            :key="i"
            :value="'tab-' + i"
          >
            <v-card flat class="mt-4 mb-4">
              <app-rating-product :product="product"></app-rating-product>
              <h2 class="mb-2">{{ item.name }}</h2>
              <v-flex xs12 v-if="item.name == 'Графика'" class="pt-0 pb-0">
                <v-carousel>
                  <v-carousel-item
                    v-for="(imageSrc, k) in product.imageSrc"
                    :key="k"
                    :src="imageSrc"
                  ></v-carousel-item>
                </v-carousel>
              </v-flex>
              {{ item.text }}
              <h2 class="mb-2 mt-2">Обзоры:</h2>
              <v-expansion-panel>
                <v-expansion-panel-content
                  v-for="(review,i) in item.comment"
                  :key="i"
                >
                  <v-list slot="header" three-line>

                    <v-list-tile
                      key="Brunch this weekend?"
                      avatar
                      @click=""
                    >
                      <v-list-tile-avatar>
                        <img src="https://cdn.vuetifyjs.com/images/lists/1.jpg">
                      </v-list-tile-avatar>

                      <v-list-tile-content>
                        <v-list-tile-title>Brunch this weekend?</v-list-tile-title>
                        <v-list-tile-sub-title><span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?</v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                  <v-card>
                    <v-card-text>{{ review }}</v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-card>
          </v-tab-item>
        </v-tabs>
        <v-divider light></v-divider>
        <app-comment :state="product"></app-comment>
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

<style scoped>
  h3 {
    display: inline-block;
  }
  .header-content {
    margin-top: -250px;
  }
  .v-btn--small{
    height: 18px;
    min-width: 50px;
  }
  >>>.v-expansion-panel__header {
    padding-left: 0;
  }
  .bgdark{
    background-color:rgba(0,0,0,.5);
    height:100%;
    position:absolute;
    width:100%;
    top:0;
    left:0;
  }
  .userProduct {
    position: absolute;
    margin-left: 40px;
    margin-top: -135px;
  }
  >>>.userProduct #user .user-avatar{
    width: 200px;
    height: 200px;
    flex-wrap: wrap;
  }
  >>>.userProduct #user .user-avatar img{
    width: 180px;
    height: 180px;
    vertical-align: middle;
    border-radius: 100%;
    padding: 2px;
    border: 1px solid #03a87c;
  }
</style>

<script>
import EditProduct from './EditProduct'
import RatingProduct from './RatingProduct'
import Comment from '../Comment'
import User from '../User'
export default {
  props: ['id'],
  data () {
    return {
      items: [
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          title: 'Brunch this weekend?',
          subtitle: "<span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?"
        },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
          title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
          subtitle: "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend."
        },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
          title: 'Oui oui',
          subtitle: "<span class='text--primary'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?"
        }
      ]
    }
  },
  computed: {
    product () {
      const id = this.id
      return this.$store.getters.productById(id)
    },
    reviews () {
      const review = this.$store.getters.reviewById(this.id)
      const reviews = {game: [], graphic: [], sound: [], dialog: [], original: [], gameplay: []}
      for (var key in review) {
        reviews.graphic.push(review[key].reviewGraphic)
        reviews.gameplay.push(review[key].reviewGameplay)
        reviews.sound.push(review[key].reviewSound)
        reviews.dialog.push(review[key].reviewDialog)
        reviews.original.push(review[key].reviewOriginal)
        reviews.game.push(review[key].reviewGame)
      }
      return reviews
    },
    loading () {
      return this.$store.getters.loading
    },
    isOwner () {
      return this.product.ownerId === this.$store.getters.user.id
    },
    // isReviewOwner () {
    //   const review = this.$store.getters.reviewById(this.id)
    //   const user = this.$store.getters.user.id
    //   return !!review[user]
    // },
    base () {
      return [
        {name: 'Описание', icon: 'phone', text: this.product.description, comment: this.reviews.game},
        {name: 'Сюжет', icon: 'favorite', text: 'trnsrtn', comment: this.reviews.dialog},
        {name: 'Графика', icon: 'phone', text: 'sdafsrtnaf', comment: this.reviews.graphic},
        {name: 'Геймплей', icon: 'phone', text: 'sdafsrtnsrtnsrnaf', comment: this.reviews.gameplay},
        {name: 'Музыка', icon: 'account_box', text: 'sdstrnsrtnafaf', comment: this.reviews.sound},
        {name: 'Код', icon: 'phone', text: 'sdafaf', comment: this.reviews.graphic},
        {name: 'Оригинальность', icon: 'phone', text: 'sdafaf', comment: this.reviews.original}
      ]
    }
  },
  components: {
    appEditProduct: EditProduct,
    appRatingProduct: RatingProduct,
    appUser: User,
    appComment: Comment
  }
}
</script>

