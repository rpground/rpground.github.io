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
              <v-textarea
                name="description"
                label="Description"
                type="text"
                v-model="editDescription"
                required
              ></v-textarea>  
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
    props: ['diary'],
    data () {
      return {
        dialog: false,
        editTitle: this.diary.title,
        editDescription: this.diary.description
      }
    },
    methods: {
      onCancel () {
        this.editTitle = this.diary.title
        this.editDescription = this.diary.description
        this.dialog = false
      },
      onSave () {
        if (this.editTitle !== '' && this.editDescription !== '') {
          this.$store.dispatch('updateDiary', {
            title: this.editTitle,
            description: this.editDescription,
            id: this.diary.id
          })
          this.dialog = false
        }
      }
    }
  }
</script>