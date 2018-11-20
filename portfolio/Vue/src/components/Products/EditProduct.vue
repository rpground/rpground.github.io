<template>
  <v-dialog max-width="600px" v-model="dialog">
    <v-btn color="success" slot="activator">Редактировать</v-btn>
    <v-card>
        <v-card-title>
          <span class="headline">Редактировать</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" lazy-validation>
              <v-text-field
                name="title"
                label="Title"
                type="text"
                required
                v-model="editTitle"
                :rules="[v => !!v || 'поле обязательно для заполнения']"
              ></v-text-field>
              <v-autocomplete
                label="Автор:"
                persistent-hint
                multiple
              >
                <v-slide-x-reverse-transition
                  slot="append-outer"
                  mode="out-in"
                >
                </v-slide-x-reverse-transition>
              </v-autocomplete>
              <v-select
                label="Engine"
                required
              ></v-select>
              <v-select
                label="Genre"
                required
                multiple
              ></v-select>
              <v-select
                label="Setting"
                required
                multiple
              ></v-select>
              <v-textarea
                name="description"
                label="Description"
                type="text"
                v-model="editDescription"
                required
              ></v-textarea>
              <v-menu
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <v-text-field
                  slot="activator"
                  label="Дата начала разработки"
                  prepend-icon="event"
                  readonly
                  required
                ></v-text-field>
                <v-date-picker></v-date-picker>
              </v-menu>
              <v-slider
                label="Процент готовности"
                :max="100"
                :min="0"
                thumb-label="always"
                color="cyan"
                required
              ></v-slider>     
            </v-form>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="onCancel">Close</v-btn>
          <v-btn color="blue darken-1" flat @click.native="onSave">Save</v-btn>
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
        editTitle: this.product.title,
        editDescription: this.product.description
      }
    },
    methods: {
      onCancel () {
        this.editTitle = this.product.title
        this.editDescription = this.product.description
        this.dialog = false
      },
      onSave () {
        if (this.editTitle !== '' && this.editDescription !== '') {
          this.$store.dispatch('updateProduct', {
            title: this.editTitle,
            description: this.editDescription,
            id: this.product.id
          })
          this.dialog = false
        }
      }
    }
  }
</script>