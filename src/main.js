// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import lazyload from 'vue-lazyload'//图片的懒加载
import infiniteScroll from 'vue-infinite-scroll'//滚动分页插件
import {currency} from "./until/currency";//引入计算前的工具
import Vuex from 'vuex';//引入vuex
Vue.use(Vuex)//使用vuex
const store = new Vuex.Store({//实例化vuex
  state : {
    nickname : '',//登录名
    cartCount : 0,//购物车数量
    page : ''
  },
  mutations:{  //更改state的状态
    updateUserInfo(state,nickname){  //把state传递的值，修改state中的nickname--登录的名称
      state.nickname = nickname
    },
    updateCartCount(state,cartCount){  //把state传递的值，修改state中的cartCount--购物车数量
      state.cartCount += cartCount  //传递过来的数量进行加,减
    },
    initCartCount(state,cartCount){
      state.cartCount = cartCount
    },
    updatePage (state,page) {
      state.page = page
    }
  }
})
Vue.use(infiniteScroll)//使用滚动分页插件
Vue.filter("c",currency)
Vue.use(lazyload,{
  loading :'/static/loading-svg/loading-spin.svg'
});//使用懒加载

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,//将store注册到vue实例中，这时候vue的所有组件都具备了store的功能
  components: { App },
  template: '<App/>'
})
