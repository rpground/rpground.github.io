<template>
  <v-container>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md6>
          <v-card class="elevation-12">
            <v-toolbar dark color="cyan">
              <v-toolbar-title>Registration form</v-toolbar-title>
              
            </v-toolbar>
            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field 
                  prepend-icon="person"
                  name="nickname"
                  label="Nickname"
                  type="text"
                  v-model="Nickname"
                ></v-text-field>
                <v-text-field 
                  prepend-icon="email"
                  name="email"
                  label="Email"
                  type="email"
                  v-model="email"
                  :rules="emailRules"
                ></v-text-field>
                <v-text-field
                  prepend-icon="lock"
                  name="password"
                  label="Password"
                  type="password"
                  :counter="6"
                  :rules="passwordRules"
                  v-model="password"
                ></v-text-field>
                <v-text-field
                  prepend-icon="repeat"
                  name="confirm-password"
                  label="Confirm Password"
                  type="password"
                  :rules="confirmPasswordRules"
                  v-model="confirmPassword"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn 
                color="cyan"
                @click="onSubmit"
                :loading="loading"
                :disabled="!valid || loading"
              >
                Создать аккаунт
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      valid: false,
      emailRules: [
        v => !!v || 'E-mail не заполнен',
        v => /.+@.+/.test(v) || 'E-mail невалиден'
      ],
      passwordRules: [
        v => !!v || 'password не заполнен',
        v => (v && v.length >= 6) || 'пароль должен быть более 6 символов'
      ],
      confirmPasswordRules: [
        v => !!v || 'password не заполнен',
        v => (v === this.password) || 'пароли должны совпадать'
      ]
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  },
  methods: {
    onSubmit () {
      if (this.$refs.form.validate()) {
        // Native form submission is not yet supported
        const user = {
          email: this.email,
          password: this.password,
          nickname: this.nickname
        }
        this.$store.dispatch('registerUser', user)
        .then(() => {
          this.$router.push('/')
        })
        .catch(() => {})
      }
    }
  }
}
</script>