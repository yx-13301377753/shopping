import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import GoodsList from "../views/GoodsList";//引入goodlist
import Cart from "../views/cart"//引入cart购物车
import Address from "../views/Address";//引入地址的路由
import OrderConfirm from "../views/OrderConfirm";
import OrderSuccess from '../views/OrderSuccess'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList
    },
    {
      path: '/Cart',
      name: 'Cart',
      component: Cart
    },
    {
      path: '/address',
      component: Address
    },
    {
      path: '/orderComfirm',
      component: OrderConfirm
    },
    {
      path: '/orderSuccess',
      component: OrderSuccess
    }
  ]
})
