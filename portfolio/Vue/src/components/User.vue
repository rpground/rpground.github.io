<template>
  <v-layout>
    <div class="user-avatar">
      <img src="https://mfst.igromania.ru/wp-content/uploads/2018/09/arnold-768x384.jpg">
      </div>
      <div class="user-info">
      <h2>John Connor</h2>
      <div class="user-city">Москва</div>
      <div class="user-data">2018.11.24 23:06:58</div>
      </div>
      <div class="user-button">Follow</div>
  </v-layout>
</template>

<script></script>

<style scoped>
  .user{
    display: flex;
    flex-wrap: wrap;
    justify-content:flex-start;
    line-height: 1;
    width: 100%;
  }
  .user-avatar{
    width: 120px;
    height: 120px;
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
  .user-button:hover{
    background-color: #03a87c;
    color: #fff;
  }
</style>