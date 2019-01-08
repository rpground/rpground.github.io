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
              name="nick"
              label="Nickname"
              type="text"
              required
              v-model="editNick"
              :rules="[v => !!v || 'поле обязательно для заполнения']"
            ></v-text-field>
            <v-textarea
              name="city"
              label="City"
              type="text"
              v-model="editCity"
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
    props: ['user'],
    data () {
      return {
        dialog: false,
        editNick: this.user.nick,
        editCity: this.user.city
      }
    },
    methods: {
      onCancel () {
        this.editNick = this.user.nick
        this.editCity = this.user.city
        this.dialog = false
      },
      onSave () {
        if (this.editNick !== '' && this.editCity !== '') {
          this.$store.dispatch('updateUser', {
            nick: this.editNick,
            city: this.editCity,
            id: this.user.id
          })
          this.dialog = false
        }
      }
    }
  }
</script>