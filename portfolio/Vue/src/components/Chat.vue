<template>
<v-flex xs12>
  <v-card>
    <v-layout align-start>
      <v-card-title primary-title>
        <v-avatar size="46px">
          <img
            src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460"
            alt="Avatar"
          >
        </v-avatar>
      </v-card-title>
      
      <v-flex xs12>
        <v-textarea
          id="text"
          name="description"
          type="text"
          required
          :rules="[v => !!v || 'поле обязательно для заполнения']"
        ></v-textarea>
      </v-flex>    
    </v-layout>
  </v-card>

  <v-card>
    <v-layout align-start>
      <v-card-title primary-title>
        <v-avatar
          size="46px"
        >
          <img
            src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460"
            alt="Avatar"
          >
        </v-avatar>
      </v-card-title>
      <v-card-title>
        <div>
          <v-layout>
            <div class="title">Supermodel</div>
            <v-spacer></v-spacer>
            <div class="subheading grey--text">20.20.20</div>
          </v-layout>

          <div>Foster the People. Foster the People. Foster the People. Foster the People. Foster the People
          Foster the People.Foster the People.Foster the People.Foster the People</div>
        </div>
      </v-card-title>
    </v-layout> 
  </v-card>
</v-flex>
</template>

<script></script>