import Vue from 'vue'
import Router from 'vue-router'
import Tooltip from '@/components/Tooltip'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Tooltip',
      component: Tooltip
    }
  ]
})
