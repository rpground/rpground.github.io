<template>
  <v-container grid-list-lg>
    <v-layout row wrap v-if="!loading && users.length !== 0">
      <v-flex
        xs12
        sm8 offset-sm2
      >
        <v-card>
          <v-toolbar color="cyan" dark>
            <v-toolbar-side-icon></v-toolbar-side-icon>

            <v-toolbar-title>Inbox</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn icon>
              <v-icon>search</v-icon>
            </v-btn>
          </v-toolbar>
          <v-container>
            <v-flex xs12 v-for="(user, i) in users" :key="i">
              <!-- //можно сделать для онлайна. определять онлайн через свойство
                v-if="item.online"
                :key="item.online" -->
              <app-user :id="user.id" class="mt-2"></app-user>
            </v-flex>
          </v-container>

        </v-card>
      </v-flex>
    </v-layout>
    <v-layout v-else-if="!loading && users.length === 0">
      <v-flex xs12 class="text-xs-center">
        <h1 class="text--primary">You have no users</h1>
      </v-flex>
    </v-layout>
    <v-layout v-else>
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular
          :size="50"
          :width="4"
          color="cyan"
          indeterminate
        ></v-progress-circular>
      </v-flex>
    </v-layout>
  </v-container> 
</template>

<script>
import User from '../User'
export default {

  computed: {
    users () {
      return this.$store.getters.users
    },
    loading () {
      return this.$store.getters.loading
    }
  },
  components: {
    appUser: User
  }
}
</script>