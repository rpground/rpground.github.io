<template>
  <div>
    <v-navigation-drawer app temporary left clipped 
      v-model="sideNav"
    >
      <v-list>            
        <v-list-tile
          v-for="(link, i) in links"
          :key="i"
          :to="link.url"
        >

          <v-list-tile-action>
            <v-icon>{{link.icon}}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{link.title}}</v-list-tile-title>
          </v-list-tile-content>

        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer app right clipped stateless
      v-model="settingsNav"
    >
      <v-list dense>
        <v-list-tile @click.stop="right = !right">
          
      <app-tooltip></app-tooltip>  
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar dark color='cyan' clipped-right clipped-left fixed app>

      <v-toolbar-side-icon 
        @click="sideNav = !sideNav"
        class="hidden-md-and-up"
      ></v-toolbar-side-icon>

      <v-toolbar-title>
        <router-link
          :to="'/'"
          tag="span"
          style="cursor:pointer"          
        >
          RPGround
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn
          flat
          v-for="(link, i) in links"
          :key="i"
          :to="link.url"
        >
          <v-icon left>{{link.icon}}</v-icon>
        {{link.title}}</v-btn>
      </v-toolbar-items>    
      
      <v-btn
        flat
        @click.stop="onLogout"
        v-if="isUserLogin"
      >
        <v-icon>exit_to_app</v-icon>
        Logout
      </v-btn>
      <v-btn
        flat
        @click.stop="settingsNav = !settingsNav"
      >
        <v-icon>settings</v-icon>
      </v-btn> 
    </v-toolbar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </div>
</template>

<script type="text/javascript">
  import Tooltip from './Tooltip'
  export default {
    data () {
      return {
        sideNav: false,
        settingsNav: false
      }
    },
    methods: {
      onLogout () {
        this.$store.dispatch('logoutUser')
        this.$router.push('/')
      }
    },
    computed: {
      isUserLogin () {
        return this.$store.getters.isUserLogin
      },
      links () {
        if (this.isUserLogin) {
          return [
            {title: 'Cart', icon: 'shopping_cart', url: '/checkout'},
            {title: 'New Product', icon: 'add', url: '/new'},
            {title: 'My Product', icon: 'list', url: '/list'}
          ]
        }
        return [
          {title: 'Login', icon: 'account_box', url: '/login'},
          {title: 'Register', icon: 'face', url: '/register'}
        ]
      }
    },
    components: {
      appTooltip: Tooltip
    }
  }
</script>