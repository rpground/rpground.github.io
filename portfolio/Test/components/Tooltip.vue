<template>
  <v-container fluid>
    <v-layout column align-center>
      <!-- кнопка. ховер и клик можно было реализовать с помощью изменения 
        картинки,  но через "бэкграунд" скорее всего более оптимизировано -->
      <div
        class="btn"
        @click="show = !show"
        @mouseover="setBgcBtn('#f2f5f7')"
        @mouseleave="setBgcBtn('')"
        :style="{ 'background-color': bgcBtn }"
      >
        <img src="@/assets/cog.svg" alt="cog.svg">         
      </div>

      <transition  name="slide">
        <div class="dialog-settings" v-if="show">

          <div class="dialog-box">
            <div class="dialog-title">Manage rules</div>
          </div>
          <!-- тег <hr> возможно было бы лучше, но он не кроссбраузерный (не дружит с мозилой),
            поэтому решил через див-->
          <div class="hr"></div>

          <form>
            <div class="dialog-box" v-for="(setting, k) in settings" :key="k">
              <!-- меняем цвет текста через класс. можно через стиль но тогда будет зависимость от 
                первоначального цвета. в примере он везде одинаковый но "а вдруг"-->
              <label class="dialog-box-name" :class="{ 'color-cyan': setting.focused }">
                {{setting.name}}
              </label>
              <!-- линия под текстом в инпуте зависит от количества цифр введенного числа: 
              this.size=this.value.length.
              максимальный размер 20 цифр, чтобы поле не вылезло за предел формы.
              пробовал черечз 'width', но обновляется с запозданием -->
              <input
                size="1"
                maxlength="20"
                onKeyDown="this.size=this.value.length"
                @focus="onFocus(k)"
                @blur="onBlur(k)"
                v-model="setting.value"
                :placeholder="setting.value"
              >
            </div>
          </form>
        </div>
      </transition>
    </v-layout>
  </v-container>
</template>


<script>
  export default {
    data () {
      return {
        show: false,
        bgcBtn: '',
        settings: [
          {name: 'duration', value: 30, focused: false},
          {name: 'Min. votes to pass', value: 1000, focused: false},
          {name: 'VOTES per user', value: 30, focused: false}
        ]
      }
    },
    methods: {
      setBgcBtn (color) {
        (this.show === true) ? this.bgcBtn = '#edeff5' : this.bgcBtn = color
      },
      onFocus (k) {
        this.settings[k].focused = true
      },
      onBlur (k) {
        this.settings[k].focused = false
      }
    }
  }
</script>

<style scoped>
/*кнопка*/
.btn {
  width: 32px;
  height: 32px;
  padding: 6px;
  opacity: 0.9;
  border-radius: 2px;
  position: relative;
  cursor: pointer;
}
/*анимация появления тултипа*/
.slide-enter-active, .slide-leave-active {
  transition: all .3s ease;
}
.slide-enter, .slide-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
/*тултип*/
.dialog-settings {
  width: 216px;
  border-radius: 3px;
  margin-top: 16px;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .05), 0 2px 12px 0 rgba(132, 149, 163, .32);
  background-color: #fff;
  position: relative;
  font-family: Lato;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: 0.9px;
  color: #3c4a5a;
}
/*стрелочка над тултипом*/
.dialog-settings::before {
  content: '';
  position: absolute;
  margin-top: -8px;
  margin-left: 100px;
  position: absolute;        
  border: 8px solid black;
  border-color: transparent transparent #fff #fff;
  transform: rotate(135deg);        
  box-shadow: -2px 2px 6px 0 rgba(0, 0, 0, 0.05)
 }
 /*название диалогового окна*/
.dialog-title {
  font-size: 14px;
  line-height: 1.43;

  padding-top: 7px;
  padding-bottom: 5px;  
}
 /*подразделы диалоового окна*/
.dialog-box {
  margin-top: 4px;
  margin-bottom: 4px;
  padding-left: 16px;
}
 /*названия подразделов диалоового окна*/
.dialog-box-name {
  font-size: 11px;
  line-height: 1.20;
  display: block;
  padding-top: 9px;
  text-transform: uppercase;
}
/*цвет,на который изменяется текст над инпутом*/
.color-cyan {
  color: #2db9f0;
}
/*форма*/
form {
  padding: 4px 0;
}
input {
  line-height: 34px;
  letter-spacing: 0.9px;
  font-weight: normal;
}
input:focus {
  outline:none;
  box-shadow: inset 0 -2px 0 0 #2db9f0;
}
img {
  background-blend-mode: overlay;
}
/*hr через див*/
.hr {
  height: 1px;
  background-color: #e8ecf2;
}
/*цвет плейсхолдера*/
::-webkit-input-placeholder {color:#3c4a5a;}
::-moz-placeholder          {color:#3c4a5a;}/* Firefox 19+ */
:-moz-placeholder           {color:#3c4a5a;}/* Firefox 18- */
:-ms-input-placeholder      {color:#3c4a5a;}
</style>