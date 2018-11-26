import Vue from 'vue'
import Router from 'vue-router'
import AuthGuard from './auth-guard'
import Home from '@/components/Home'
import Article from '@/components/Articles/Article'
import ArticleList from '@/components/Articles/ArticleList'
import NewArticle from '@/components/Articles/NewArticle'
import Diary from '@/components/Diarys/Diary'
import DiaryList from '@/components/Diarys/DiaryList'
import NewDiary from '@/components/Diarys/NewDiary'
import Product from '@/components/Products/Product'
import ProductList from '@/components/Products/ProductList'
import NewProduct from '@/components/Products/NewProduct'
import Checkout from '@/components/User/Checkout'
import ErrorCmp from '@/components/Error'
import Login from '@/components/Auth/Login'
import Register from '@/components/Auth/Register'
import Tooltip from '@/components/Tooltip'
import Summ from '@/components/Summ'
import AddTag from '@/components/AddTag'
import User from '@/components/User'

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
      path: '',
      name: 'addtag',
      component: AddTag
    },
    {
      path: '',
      name: 'User',
      component: User
    },
    {
      path: '/summ',
      name: 'Summ',
      component: Summ
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
      path: '/article/:id',
      props: true,
      name: 'article',
      component: Article,
      beforeRouteEnter: AuthGuard
    },
    {
      path: '/listarticle',
      name: 'listarticle',
      component: ArticleList,
      beforeRouteEnter: AuthGuard
    },
    {
      path: '/newarticle',
      name: 'newarticle',
      component: NewArticle,
      beforeRouteEnter: AuthGuard
    },
    {
      path: '/diary/:id',
      props: true,
      name: 'diary',
      component: Diary,
      beforeRouteEnter: AuthGuard
    },
    {
      path: '/listdiary',
      name: 'listdiary',
      component: DiaryList,
      beforeRouteEnter: AuthGuard
    },
    {
      path: '/newdiary',
      name: 'newdiary',
      component: NewDiary,
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
