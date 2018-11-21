<template>
  <v-container grid-list-md text-xs-center>
    <v-layout>
      <div v-for="(numm, key) in numms" :key="numm.id" class="summ">
        <v-flex d-flex>
          <v-flex xs6 d-flex>
            <form class="num">
              <input type="text" maxlength="2" v-model="numm.sup">
              <hr>
              <input type="text" maxlength="2" v-model="numm.sub">
            </form>
          </v-flex>

          <v-flex xs6 d-flex align-center>
            <div class="sign" v-if="key===numms.length-1" xs6>=</div>
            <div class="sign" xs6 v-else>+</div>
          </v-flex>
        </v-flex>

        <v-layout v-if="key>1">
          <button v-on:click="deleteNum(key)">delete</button>
        </v-layout>
      </div>

      <v-flex xs6 d-flex align-center>{{getSumm}}</v-flex>
    </v-layout>

    <v-layout>
      <button v-on:click="pushNum">Add new element</button>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        numms: [
          {sub: null, sup: null},
          {sub: null, sup: null}
        ]
      }
    },
    beforeUpdate () {
      this.numms.map((numm) => {
        if (numm.sub !== null) {
          if (numm.sub[0] === 0) numm.sub = ''
          numm.sub = numm.sub.replace(/[^0-9]/gim, '')
        }
        if (numm.sup !== null) {
          if (numm.sup[0] === 0) numm.sup = ''
          numm.sup = numm.sup.replace(/[^0-9]/gim, '')
        }
      })
    },
    methods: {
      pushNum () {
        if (this.numms.length < 5) {
          this.numms.push({sub: null, sup: null})
        } else alert('кол-во дробьей не мождет быть больше 5')
      },
      deleteNum (key) {
        console.log(key)
        this.numms.splice(key, 1)
      }
    },
    computed: {
      getSumm () {
        return this.numms.reduce((summ, numm) => {
          return (numm.sup && numm.sub && summ !== 'введите цифры в поля')
            ? summ + numm.sup / numm.sub
            : 'введите цифры в поля'
        }, 0)
      }
    }
  }
</script>

<style scoped>
.container.grid-list-md .layout .flex {
     padding: 0; 
}
.summ {
  width: 100px;
  padding: 0;
  display: inline-block;
}
.sign {
  font-size: 36px;
  font-weight: 100;
  padding: 4px 0;
}

/*форма*/
form {
  padding: 4px 0;
}
input {
  width: 34px;
  line-height: 34px;
  margin: 4px;
  padding: 0 4px;
  background-color: #ddd;
  border: solid 1px #bbb;
  letter-spacing: 0.9px;
  font-weight: normal;
}
input:focus {
  outline:none;
  box-shadow: inset 0 -2px 0 0 #2db9f0;
}
/*hr через див*/
.hr {
  height: 1px;
  background-color: #e8ecf2;
}
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}

</style>