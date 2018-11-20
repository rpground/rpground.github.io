import Vue from 'vue'
import Router from 'vue-router'
import AuthGuard from './auth-guard'
import Home from '@/components/Home'
import NewProduct from '@/components/Products/NewProduct'
import Product from '@/components/Products/Product'
import ProductList from '@/components/Products/ProductList'
import Checkout from '@/components/User/Checkout'
import ErrorCmp from '@/components/Error'
import Login from '@/components/Auth/Login'
import Register from '@/components/Auth/Register'
import Tooltip from '@/components/Tooltip'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '',
      name: 'home',
      component: Home
    },
    {
      path: '',
      name: 'Tooltip',
      component: Tooltip
    },
    {
      path: '/product/:id',
      props: true,
      name: 'product',
      component: Product,
      beforeRouteEnter: AuthGuard
    },
    {
      path: '/list',
      name: 'list',
      component: ProductList,
      beforeRouteEnter: AuthGuard
    },
    {
      path: '/new',
      name: 'new',
      component: NewProduct,
      beforeRouteEnter: AuthGuard
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: Checkout,
      beforeRouteEnter: AuthGuard
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '*',
      component: ErrorCmp
    }
  ],
  mode: 'history'
})
