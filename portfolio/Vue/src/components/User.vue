<template>
  <v-layout v-if="!loading">
    <div class="user-avatar">
      <img :src="user.ava">
    </div>
    <div class="user-info">
      <h2>{{ user.nick }}</h2>
      <div class="user-city">{{ user.city }}</div>
      <div class="user-data">2018.11.24 23:06:58</div>
    </div>
    <v-spacer></v-spacer>
    <div class="user-button">Follow</div>
  </v-layout>
  <v-container v-else xs12 class="text-xs-center pt-5">
    <v-progress-circular
      :size="50"
      :width="4"
      color="cyan"
      indeterminate
    ></v-progress-circular>        
  </v-container>
</template>

<script>
  export default {
    props: ['id'],
    computed: {
      user () {
        const id = this.id
        return this.$store.getters.userById(id)
      },
      loading () {
        return this.$store.getters.loading
      }
    }
  }
</script>

<style scoped>
  .user{
    display: flex;
    flex-wrap: wrap;
    justify-content:flex-start;
    line-height: 1;
    width: 100%;
  }
  .user-avatar{
    width: 110px;
    height: 110px;
    flex-wrap: wrap;
  }
  .user-avatar img{
    width: 80px;
    height: 80px;
    vertical-align: middle;
    border-radius: 100%;
    padding: 2px;
    border: 1px solid #03a87c;
  }
  .user-info{
    flex-wrap: wrap;
  }
  .user-city, .user-data,.user-button{
    opacity: .54;
    font-size: 16px;
  }
  .user-data{
    font-size: 12px;
    margin-top: 12px;
  }
  .user-button{
    padding: 0 15px;
    margin-top: 6px;
    margin-left: 20px;
    height: 20px;
    border: 1px solid #03a87c;
    border-radius: 4px;
    color: #03a87c;
    font-size: 12px;
    line-height: 20px;
    cursor: pointer;
  }
  @media (max-width: 600px) {
    .user-button{
      padding: 0 5px;
      font-size: 10px;
    }
    .user-city, .user-data{
      font-size: 12px;
    }
  }
  @media (min-width: 600px) {
    >>> .spacer {
      display: none;
    }
  }
  .user-button:hover{
    background-color: #03a87c;
    color: #fff;
  }
</style>