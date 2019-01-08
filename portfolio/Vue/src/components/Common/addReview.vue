<template>
  <v-dialog max-width="600px" v-model="dialog">
    <v-btn color="warning" slot="activator">Добавить обзор</v-btn>
    <v-card>
      <v-card-title>
        <span class="headline">Добавить обзор</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form" lazy-validation>
            <v-textarea
              name="title"
              label="Графика"
              type="text"
              v-model="reviewGraphic"
            ></v-textarea>
            <v-textarea
              name="title"
              label="Геймплей"
              type="text"
              v-model="reviewGameplay"
            ></v-textarea>
            <v-textarea
              name="title"
              label="Звук"
              type="text"
              v-model="reviewSound"
            ></v-textarea>
            <v-textarea
              name="title"
              label="Сюжет, диалоги"
              type="text"
              v-model="reviewDialog"
            ></v-textarea>
            <v-textarea
              name="title"
              label="Оригинальность"
              type="text"
              v-model="reviewOriginal"
            ></v-textarea>
            <v-textarea
              name="title"
              label="Общая оценка"
              type="text"
              v-model="reviewGame"
            ></v-textarea>
            
          </v-form>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          class="mb-4"
          color="warning"
          flat
          @click.native="onCancel"
          :disabled="localLoading"
        >Закрыть</v-btn>
        <v-btn
          class="mb-4"
          color="success"
          @click.native="onSave"
          :disabled="localLoading"
          :loading="localLoading"
        >В избранное</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: ['product'],
    data () {
      return {
        dialog: false,
        reviewGraphic: '',
        reviewGameplay: '',
        reviewSound: '',
        reviewDialog: '',
        reviewOriginal: '',
        reviewGame: '',
        localLoading: false
      }
    },
    methods: {
      onCancel () {
        this.reviewGraphic = ''
        this.reviewGameplay = ''
        this.reviewSound = ''
        this.reviewDialog = ''
        this.reviewOriginal = ''
        this.reviewGame = ''
        this.dialog = false
      },
      onSave () {
        if (this.reviewGame !== '') {
          this.localLoading = true
          this.$store.dispatch('addReview', {
            reviewGraphic: this.reviewGraphic,
            reviewGameplay: this.reviewGameplay,
            reviewSound: this.reviewSound,
            reviewDialog: this.reviewDialog,
            reviewOriginal: this.reviewOriginal,
            reviewGame: this.reviewGame,
            productId: this.product.id,
            ownerId: this.product.ownerId
          })
          .finally(() => {
            this.reviewGraphic = ''
            this.reviewGameplay = ''
            this.reviewSound = ''
            this.reviewDialog = ''
            this.reviewOriginal = ''
            this.reviewGame = ''
            this.localLoading = false
            this.dialog = false
          })
        }
      }
    }
  }
</script>

<style scoped>
  >>> .v-card__text {
    overflow-y: scroll;
    max-height: 600px; 
  }
</style>