<template>
  <div>
    <v-navigation-drawer app temporary left clipped 
      v-model="sideNav"
    >
      <v-list>
        <v-list-group
          v-for="(link, i) in links"
          :key="i"
          :to="link.url"
          :prepend-icon="link.icon"
          no-action
        >
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title>{{link.title}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

            <v-list-tile
              v-for="(link, index) in link.urlArr"
              :key="index"
              :to="link.url"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{link.title}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
        </v-list-group>
      </v-list>

      <v-list>
        <v-list-tile
          @click.stop="onLogout"
          v-if="isUserLogin"
        >
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Выйти</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer app right clipped stateless
      v-model="settingsNav"
      width="600"
    >
      <v-list dense>
        <v-list-tile @click.stop="right = !right">
          <app-tooltip></app-tooltip>  
        </v-list-tile>
      </v-list>
      <!-- <app-chat :state="diary"></app-chat> -->
    </v-navigation-drawer>

    <v-toolbar dark color='primary' clipped-right clipped-left fixed app>

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

      <v-toolbar-items v-for="(link, i) in links" :key="i" class="hidden-sm-and-down">
        <v-menu
          v-if="link.urlArr" 
          offset-y
          origin="center center"
          transition="scale-transition"  
        >
          <v-btn flat slot="activator">
            <v-icon left>{{link.icon}}</v-icon>
            {{link.title}}
          </v-btn>

          <v-list>
            <v-list-tile
              v-for="(link, index) in link.urlArr"
              :key="index"
              :to="link.url"
            >
              {{link.title}}
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-btn v-else flat :to="link.url">
          <v-icon left>{{link.icon}}</v-icon>
          {{link.title}}
        </v-btn>
      </v-toolbar-items>

      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn
          flat
          @click.stop="onLogout"
          v-if="isUserLogin"
        >
          <v-icon>exit_to_app</v-icon>
          Выйти
        </v-btn>
        <v-btn
          flat
          @click.stop="settingsNav = !settingsNav"
        >
          <v-icon>settings</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </div>
</template>

<script>
  import Tooltip from './Tooltip'
  import Chat from './Chat'
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
      diary () {
        const id = '-LSCIpSbEok_h_I95rnw'
        return this.$store.getters.diaryById(id)
      },
      isUserLogin () {
        return this.$store.getters.isUserLogin
      },
      links () {
        if (this.isUserLogin) {
          return [
            {
              title: 'игры',
              icon: 'videogame_asset',
              urlArr: [
                {title: 'Добавить игру', icon: 'add', url: '/new'},
                {title: 'Игры', icon: 'add', url: '/list'},
                {title: 'Мои игры', icon: 'add', url: '/mylist'}
              ]
            },
            {
              title: 'статьи',
              icon: 'list',
              urlArr: [
                {title: 'Добавить статью', icon: 'add', url: '/newarticle'},
                {title: 'Все статьи', icon: 'add', url: '/listarticle'},
                {title: 'Мои статьи', icon: 'add', url: '/mylistarticle'}
              ]
            },
            {
              title: 'дневники',
              icon: 'library_books',
              urlArr: [
                {title: 'Добавить запись в дневник', icon: 'add', url: '/newdiary'},
                {title: 'Все дневники', icon: 'add', url: '/listdiary'},
                {title: 'Мой дневник', icon: 'add', url: '/mylistdiary'}
              ]
            },
            {
              title: 'галерея',
              icon: 'perm_media',
              urlArr: [
                {title: 'Добавить в галерею', icon: 'add', url: ''},
                {title: 'Галерея', icon: 'add', url: ''},
                {title: 'Моя галерея', icon: 'add', url: ''}
              ]
            },
            {
              title: 'музыка',
              icon: 'library_music',
              urlArr: [
                {title: 'Добавить трек', icon: 'add', url: ''},
                {title: 'Все треки', icon: 'add', url: ''},
                {title: 'Мои треки', icon: 'add', url: ''}
              ]
            },
            {
              title: 'код',
              icon: 'code',
              urlArr: [
                {title: 'Добавить скрипт, плагин', icon: 'add', url: '/newcode'},
                {title: 'Все скрипты', icon: 'add', url: '/listcode'},
                {title: 'Мои скрипты', icon: 'add', url: '/mylistcode'}
              ]
            },
            {
              title: 'Авторы',
              icon: 'contacts',
              url: '/listuser'
            }
          ]
        }
        return [
          {title: 'Войти', icon: 'account_box', url: '/login'},
          {title: 'Зарегистрироваться', icon: 'face', url: '/register'},
          {title: 'Summ', icon: 'add', url: '/summ'}
        ]
      }
    },
    components: {
      appTooltip: Tooltip,
      appChat: Chat
    }
  }
</script>